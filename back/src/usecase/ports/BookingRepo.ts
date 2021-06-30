import { Booking } from "../../domain/domain";

export interface BookingRepo {
  bookPlace(booking: Booking): Promise<void>;

  deleteBooking(bookingId: string): Promise<void>;

  getBooking(bookingId: string): Promise<Booking>;

  getBookings(officeId: string, date: string): Promise<Booking[]>;

  getUserBookings(email: string, date: string): Promise<Booking[]>;

  getUserNextBooking(email: string): Promise<Booking | null>;

  confirmPresence(bookingId: string): Promise<void>;
}
