import { v4 as uuid } from "uuid";
import { format } from "date-fns";

import { BookingRepo } from "../usecase/ports/BookingRepo";
import { Booking } from "../domain/domain";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

export class InMemoryBookingRepo implements BookingRepo {
  booking: Booking = {
    id: "123",
    date: '20210128',
    email: "normal-user@mail.com",
    placeId: "place_1",
    officeId: "office_1",
    confirmed: true
  }

  bookPlace(booking: Booking): Promise<void> {
    return Promise.resolve();
  }
  deleteBooking(bookingId: any): Promise<void> {
    return Promise.resolve();
  }
  getBooking(bookingId: any): Promise<Booking> {
    return Promise.resolve(this.booking)
  }
  getBookings(officeId: string, date: string): Promise<Booking[]> {
    throw new Error("Method not implemented.");
  }
  getUserBookings(email: string, date: string): Promise<Booking[]> {
    throw new Error("Method not implemented.");
  }
  getUserNextBooking(email: string): Promise<Booking> {
    throw new Error("Method not implemented.");
  }
  confirmPresence(bookingId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
