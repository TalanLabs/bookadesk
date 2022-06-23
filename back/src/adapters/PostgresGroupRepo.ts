import {GroupRepo} from "../usecase/ports/GroupRepo";
import { v4 as uuid } from "uuid";
import {Client} from "pg";

interface DbGroup {
    id: string;
    name: string;
}

export class PostgresGroupRepo implements GroupRepo {
    private client;

    constructor(client: Client) {
        this.client = client;
    }

    async create(name: string): Promise<string> {
        const id = uuid();
        const text =
            "INSERT INTO groups(id, name) VALUES($1, $2) RETURNING id";
        try {
            const res = await this.client.query(text, [id, name]);
            return res;
        } catch (err) {
            console.error("failed to create group", err.stack);
            return err;
        }
    }
}