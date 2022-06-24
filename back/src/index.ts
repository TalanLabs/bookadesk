import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import Keycloak from "keycloak-connect";
import morgan from "morgan";
import DBMigrate from "db-migrate";

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
import serveStatic from "serve-static";
import { RealTimeProvider } from "./adapters/RealTimeProvider";
import { PostgresGroupRepo } from "./adapters/PostgresGroupRepo";

async function startApp() {
  dotenv.config();

  let version = "?";
  if (process.env.VERSION) {
    version = process.env.VERSION;
  } else {
    try {
      version = fs.readFileSync("version", "utf8");
    } catch {
      console.error("version not found");
    }
  }

  // DB migrations
  await migrateDb();

  // DynamoDB
  const awsConfig = {
    region: "eu-west-3"
  };
  AWS.config.update(awsConfig);
  const docClient = new AWS.DynamoDB.DocumentClient();

  const app = express();

  // Serve frontend
  if (process.env.SERVE_FRONT) {
    const frontPath = "../front/dist";
    app.use(serveStatic(frontPath));
  }

  app.use(express.json());
  app.use(cors());

  // Routes without authentication
  app.get("/api/health", (req, res: express.Response) => {
    res.status(200).send({ status: "UP", version: version });
  });
  app.get("/api/config", (req, res) => {
    return res.status(200).send({
      keycloakRealm: process.env.KEYCLOAK_REALM,
      hidePlans: process.env.HIDE_PLANS == "true" || false
    });
  });

  app.use(morgan("tiny"));

  // Security
  const realmPublicKey =
    process.env.KEYCLOAK_REALM_PUBLIC_KEY ||
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnKq0+MnftyVe4ZfzIV2bk5L80dRTn3UIjayKhZuEBd77kNIzQgMAyUg35CQtxBpXmtLfqyyW3wXyD/qtrx2pyFx4l/x2JR4XKtq9SM9mRB30JZO9CFFlmzbTZ7xQuefk/mBqGEapau0ky04AwJoc9H2Yxuom96+8kYx9dEZmaBdTyHxppC3pS5jesLUsEDtmu9i0evxajZkf42iv63d+ONpLKx3wkmNFdkLI7uYiuaxKdoZNnkLMZr3iyvGw7C5kI7ubCp41MJcHhNyqERa84Ibl+xREwKhMj1bs5SlB18URPfJVZAs0RvlJZKbO4m9nHw4WNZ6Qu+xjESZCiQSkRQIDAQAB";
  const realmName = process.env.KEYCLOAK_REALM || "Talan";

  const memoryStore = new session.MemoryStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kcConfig: any = {
    clientId: "desk-booking-back",
    bearerOnly: true,
    serverUrl: "https://keycloak.ruche-labs.net/auth",
    realm: realmName,
    realmPublicKey: realmPublicKey
  };
  const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
  // app.use(keycloak.middleware());

  // Server
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.info(
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
  const groupRepo = new PostgresGroupRepo(pgClient);

  console.info("Repositories initialized");

  const emailGateway = new NodemailerEmailGateway();

  const timeProvider = new RealTimeProvider();

  // Routes
  const router = createRoutes(
    keycloak,
    bookingRepo,
    officeRepo,
    suppliesRepo,
    imageRepo,
    groupRepo,
    emailGateway,
    timeProvider
  );
  app.use("/api", router);
}

startApp().then(() => console.info("Server started"));

function cleanTerminate(signal: NodeJS.Signals): void {
  console.info("cleaning before terminating process ...", {
    signal: signal
  });
  process.exit(0);
}

function needPostgres(): boolean {
  return process.env.OFFICES_REPO === "POSTGRES";
}

function migrateDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const dbmigrate = DBMigrate.getInstance(true);
      dbmigrate.up().then(() => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
