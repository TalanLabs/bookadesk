import { v4 as uuid } from "uuid";
import { format } from "date-fns";

import { BookingRepo } from "../usecase/ports/BookingRepo";
import { Booking } from "../domain/domain";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

export class DynamoDbBookingRepo implements BookingRepo {
  bookings: Map<string, Booking[]> = new Map();
  private documentClient: DocumentClient;
  private readonly tableName: string;

  constructor(documentClient: DocumentClient, dbPrefix: string) {
    this.documentClient = documentClient;
    this.tableName = dbPrefix + "Bookings";
  }

  bookPlace = (booking: Booking): Promise<void> => {
    const params = {
      TableName: this.tableName,
      Item: {
        id: uuid(),
        email: booking.email,
        placeId: booking.placeId,
        date: booking.date,
        officeId: booking.officeId,
        createdAt: Date.now(),
      },
      ConditionExpression: "#placeId <> :placeId",
      ExpressionAttributeNames: {
        "#placeId": "placeId",
      },
      ExpressionAttributeValues: { ":placeId": booking.placeId },
    };

    this.documentClient.put(params, function (err, data) {
      if (err) {
        console.error(
          "Unable to add booking",
          ". Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.info("Reservation added: " + JSON.stringify(booking));
      }
    });
    return Promise.resolve();
  };

  async getBookings(officeId: string, date: string): Promise<Booking[]> {
    try {
      const params = {
        TableName: this.tableName,
        ExpressionAttributeValues: {
          ":d": date,
          ":o": officeId,
        },
        // ProjectionExpression: "#yr, title, info.rating",
        FilterExpression: "#date = :d and officeId = :o",
        ExpressionAttributeNames: {
          "#date": "date",
        },
      };

      let bookings = await this.documentClient.scan(params).promise();
      return bookings.Items as Booking[];
    } catch (e) {
      console.error("Failed to fetch bookings", e);
      throw new Error("Failed to fetch bookings");
    }
  }

  async getUserBookings(email: string, date: string): Promise<Booking[]> {
    try {
      const params = {
        TableName: this.tableName,
        ExpressionAttributeNames: {
          "#date": "date",
        },
        ExpressionAttributeValues: {
          ":d": date,
          ":e": email,
        },
        // ProjectionExpression: "#yr, title, info.rating",
        FilterExpression: "#date = :d and email = :e",
      };
      let bookings = await this.documentClient.scan(params).promise();
      return bookings.Items as Booking[];
    } catch (e) {
      console.error("Failed to fetch bookings", e);
      throw new Error("Failed to fetch bookings");
    }
  }

  async getUserNextBooking(email: string): Promise<Booking | null> {
    const today = format(new Date(), "yyyyMMdd");
    try {
      const params = {
        TableName: this.tableName,
        ExpressionAttributeNames: {
          "#date": "date",
        },
        ExpressionAttributeValues: {
          ":d": today,
          ":e": email,
        },
        FilterExpression: "#date >= :d and email = :e",
      };
      let result = await this.documentClient.scan(params).promise();
      let bookings = result.Items as Booking[];
      if (bookings.length === 0) {
        return null;
      }
      bookings = bookings.sort((a, b) => parseInt(a.date) - parseInt(b.date));
      return bookings[0];
    } catch (e) {
      console.log("Failed to fetch bookings", e);
      throw new Error("Failed to fetch bookings");
    }
  }

  async deleteBooking(bookingId): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: bookingId },
      };
      await this.documentClient.delete(params).promise();
    } catch (e) {
      console.log("Failed to delete bookings", e);
      throw new Error("Failed to delete bookings");
    }
  }

  async getBooking(bookingId): Promise<Booking> {
    try {
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": bookingId,
        },
      };
      const result = await this.documentClient.query(params).promise();
      const bookings = result.Items as Booking[];
      return bookings[0];
    } catch (e) {
      console.error("Failed to fetch bookings", e);
      throw new Error("Failed to fetch bookings");
    }
  }

  async confirmPresence(bookingId: string): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        Key: {
          id: bookingId,
        },
        UpdateExpression: "set confirmed=:c",
        ExpressionAttributeValues: {
          ":c": true,
        },
        ReturnValues: "UPDATED_NEW",
      };
      await this.documentClient.update(params).promise();
    } catch (e) {
      console.error("Failed to confirm booking", e);
      throw new Error("Failed to confirm booking");
    }
  }
}
