import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import Keycloak from "keycloak-connect";
import morgan from "morgan";

// AWS should be imported after setting up the environment variables.
import AWS from "aws-sdk";
import session from "express-session";
import { DynamoDbBookingRepo } from "./adapters/DynamoDbBookingRepo";
import * as fs from "fs";
import config from "./config";
import { createRoutes } from "./router";
import { DynamoDbSuppliesRepo } from "./adapters/DynamoDbSuppliesRepo";
import { S3ImageRepo } from "./adapters/S3ImageRepo";
import { NodemailerEmailGateway } from "./adapters/NodemailerEmailGateway";

import { PostgresOfficeRepo } from "./adapters/PostgresOfficeRepo";
import { Client } from "pg";
import { DynamoDbOfficeRepo } from "./adapters/DynamoDbOfficeRepo";
import { FileImageRepo } from "./adapters/FileImageRepo";
import { ImageRepo } from "./usecase/ports/ImageRepo";
import { initDb } from "./infra/postgres";
import { checkDirectoryExists } from "./infra/file";
import { PostgresBookingRepo } from "./adapters/PostgresBookingRepo";
import { BookingRepo } from "./usecase/ports/BookingRepo";
import { OfficeRepo } from "./usecase/ports/OfficeRepo";

async function startApp() {
  dotenv.config();

  let version = "?";
  try {
    version = fs.readFileSync("version", "utf8");
  } catch {
    console.error("version not found");
  }

  // DynamoDB
  const awsConfig = {
    region: "eu-west-3"
  };
  AWS.config.update(awsConfig);
  const docClient = new AWS.DynamoDB.DocumentClient();

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/health", (req, res: express.Response) => {
    res.status(200).send({ status: "UP", version: version });
  });

  app.use(morgan("tiny"));

  // Security
  const memoryStore = new session.MemoryStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kcConfig: any = {
    clientId: "desk-booking-back",
    bearerOnly: true,
    serverUrl: "https://keycloak.ruche-labs.net/auth",
    realm: "Talan",
    realmPublicKey:
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnKq0+MnftyVe4ZfzIV2bk5L80dRTn3UIjayKhZuEBd77kNIzQgMAyUg35CQtxBpXmtLfqyyW3wXyD/qtrx2pyFx4l/x2JR4XKtq9SM9mRB30JZO9CFFlmzbTZ7xQuefk/mBqGEapau0ky04AwJoc9H2Yxuom96+8kYx9dEZmaBdTyHxppC3pS5jesLUsEDtmu9i0evxajZkf42iv63d+ONpLKx3wkmNFdkLI7uYiuaxKdoZNnkLMZr3iyvGw7C5kI7ubCp41MJcHhNyqERa84Ibl+xREwKhMj1bs5SlB18URPfJVZAs0RvlJZKbO4m9nHw4WNZ6Qu+xjESZCiQSkRQIDAQAB"
  };
  const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
  app.use(keycloak.middleware());

  // Server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(
      `Talan desk booking app listening on port ${port}! Version ${version}`
    );
    process.on("SIGABRT", cleanTerminate);
    process.on("SIGINT", cleanTerminate);
    process.on("SIGBREAK", cleanTerminate);
  });

  // DB init
  let pgClient: Client;
  if (needPostgres()) {
    pgClient = await initDb();
  }

  // Init repos
  console.info("Initialize repositories...");
  let officeRepo: OfficeRepo;
  if (process.env.OFFICES_REPO === "POSTGRES") {
    officeRepo = new PostgresOfficeRepo(pgClient);
  } else {
    officeRepo = new DynamoDbOfficeRepo(docClient, config.dbPrefix);
  }
  let bookingRepo: BookingRepo;
  if (process.env.BOOKINGS_REPO === "POSTGRES") {
    bookingRepo = new PostgresBookingRepo(pgClient);
  } else {
    bookingRepo = new DynamoDbBookingRepo(docClient, config.dbPrefix);
  }
  const suppliesRepo = new DynamoDbSuppliesRepo(docClient, config.dbPrefix);
  let imageRepo: ImageRepo;
  if (process.env.IMAGE_REPO === "S3") {
    imageRepo = new S3ImageRepo(config.s3Suffix);
  } else {
    const filesPath = process.env.IMAGES_PATH || "./images";
    await checkDirectoryExists(filesPath);
    imageRepo = new FileImageRepo(filesPath);
  }
  console.info("Repositories initialized");

  // Init gateway
  const emailGateway = new NodemailerEmailGateway();

  // Routes
  const router = createRoutes(
    keycloak,
    bookingRepo,
    officeRepo,
    suppliesRepo,
    imageRepo,
    emailGateway
  );
  app.use(router);
}

startApp().then(() => console.info("Server started"));

function cleanTerminate(signal: NodeJS.Signals): void {
  console.log("cleaning before terminating process ...", { signal: signal });
  process.exit(0);
}

function needPostgres(): boolean {
  return process.env.OFFICES_REPO === "POSTGRES";
}
