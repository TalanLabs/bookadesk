import { v4 as uuid } from "uuid";
import _ from "lodash";

import { MissingSupply } from "../domain/domain";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { SuppliesRepo } from "../usecase/ports/SuppliesRepo";

interface DbSupply {
  id: string;
  type: string;
  officeId: string;
  comments: string;
  createdAt: number;
}

export class DynamoDbSuppliesRepo implements SuppliesRepo {
  private documentClient: DocumentClient;
  private readonly tableName: string;

  constructor(documentClient: DocumentClient, dbPrefix: string) {
    this.documentClient = documentClient;
    this.tableName = dbPrefix + "MissingSupplies";
  }

  async addMissingSupply(missingSupply: MissingSupply): Promise<void> {
    try {
      const params = {
        Item: { ...missingSupply, id: uuid(), createdAt: Date.now() },
        TableName: this.tableName,
      };
      await this.documentClient.put(params).promise();
    } catch (e) {
      console.error("Failed to update place", e);
      throw new Error("Failed to update place");
    }
  }

  async getMissingSupplies(officeId: string): Promise<MissingSupply[]> {
    try {
      const params = {
        TableName: this.tableName,
        ExpressionAttributeValues: {
          ":o": officeId,
        },
        FilterExpression: "officeId = :o",
      };

      const promise = await this.documentClient.scan(params).promise();
      const dbMissingSupplies = promise.Items as DbSupply[];
      const missingSupplies = dbMissingSupplies.map((p) =>
        DynamoDbSuppliesRepo.missingSupplyFromDb(p)
      );
      return _.sortBy(missingSupplies, ["createdAt"]).reverse();
    } catch (e) {
      console.error("Failed to fetch places", e);
      throw new Error("Failed to fetch places");
    }
  }

  private static missingSupplyFromDb(db: DbSupply): MissingSupply {
    return {
      id: db.id,
      comments: db.comments,
      createdAt: db.createdAt,
      officeId: db.officeId,
      type: db.type,
    };
  }
}
