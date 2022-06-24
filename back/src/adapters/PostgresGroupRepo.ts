import { GroupRepo } from "../usecase/ports/GroupRepo";
import { v4 as uuid } from "uuid";
import { Client } from "pg";
import { Group } from "../domain/domain";

interface DbGroup {
  id: string;
  name: string;
}

function dbToGroup(db: DbGroup): Group {
  return {
    id: db.id,
    name: db.name
  };
}

export class PostgresGroupRepo implements GroupRepo {
  private client;

  constructor(client: Client) {
    this.client = client;
  }
  async list(): Promise<Group[]> {
    const q = "SELECT * FROM groups";
    try {
      const res = await this.client.query(q);
      return res.rows.map(dbToGroup);
    } catch (err) {
      console.error("failed to fetch groups", err.stack);
      return err;
    }
  }

  async create(name: string): Promise<string> {
    const id = uuid();
    const text = "INSERT INTO groups(id, name) VALUES($1, $2) RETURNING id";
    try {
      const res = await this.client.query(text, [id, name]);
      return res;
    } catch (err) {
      console.error("failed to create group", err.stack);
      return err;
    }
  }
}
