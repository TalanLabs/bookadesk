import { BookingRepo } from "../usecase/ports/BookingRepo";
import { Booking } from "../domain/domain";

export class InMemoryBookingRepo implements BookingRepo {
  booking: Booking = {
    id: "123",
    date: "20210128",
    email: "normal-user@mail.com",
    placeId: "place_1",
    officeId: "office_1",
    confirmed: true
  };

  bookPlace(): Promise<void> {
    return Promise.resolve();
  }
  deleteBooking(): Promise<void> {
    return Promise.resolve();
  }
  getBooking(): Promise<Booking> {
    return Promise.resolve(this.booking);
  }
  getBookings(): Promise<Booking[]> {
    throw new Error("Method not implemented.");
  }
  getUserBookings(): Promise<Booking[]> {
    throw new Error("Method not implemented.");
  }
  getUserNextBooking(): Promise<Booking> {
    throw new Error("Method not implemented.");
  }
  confirmPresence(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
