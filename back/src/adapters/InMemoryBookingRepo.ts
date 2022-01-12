import { BookingRepo } from "../usecase/ports/BookingRepo";
import { Booking } from "../domain/domain";

export class InMemoryBookingRepo implements BookingRepo {
  bookings: Booking[] = [];

  bookPlace(booking: Booking): Promise<void> {
    this.bookings.push(booking);
    return Promise.resolve();
  }

  deleteBooking(bookingId: string): Promise<void> {
    this.bookings = this.bookings.filter(b => b.id !== bookingId);
    return Promise.resolve();
  }

  getBooking(bookingId: string): Promise<Booking> {
    return Promise.resolve(this.bookings.find(b => b.id === bookingId));
  }

  getBookings(officeId: string, date: string): Promise<Booking[]> {
    return Promise.resolve(
      this.bookings.filter(b => b.officeId === officeId && b.date === date)
    );
  }

  getUserBookings(email: string, date: string): Promise<Booking[]> {
    return Promise.resolve(
      this.bookings.filter(b => b.email === email && b.date === date)
    );
  }

  getUserNextBooking(): Promise<Booking> {
    throw new Error("Method not implemented.");
  }

  confirmPresence(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getPlaceBookingsAfterDate(): Promise<Booking[]> {
    return Promise.resolve([]);
  }

  getUserNextBookings(): Promise<Booking[]> {
    return Promise.resolve([]);
  }

  getAllBookings(
    officeId: string,
    startDate: string,
    endDate: string
  ): Promise<Booking[]> {
    return Promise.resolve(
      this.bookings.filter(
        b => b.officeId === officeId && b.date >= startDate && b.date <= endDate
      )
    );
  }
}
