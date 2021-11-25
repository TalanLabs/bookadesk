import { Client, ClientConfig } from "pg";

export const initDb = async (): Promise<Client> => {
  try {
    const config: ClientConfig = {
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT)
    };
    const pgClient: Client = new Client(config);
    await pgClient.connect();
    console.info(`Connected to Postgres database`);
    return pgClient;
  } catch (e) {
    console.error("failed to connect to DB", e);
    process.exit(0);
  }
};
