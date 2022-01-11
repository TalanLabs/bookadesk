import { Booking } from "../../domain/domain";

export interface BookingRepo {
  bookPlace(booking: Booking): Promise<void>;

  deleteBooking(bookingId: string): Promise<void>;

  getBooking(bookingId: string): Promise<Booking>;

  getBookings(officeId: string, date: string): Promise<Booking[]>;

  getAllBookings(
    officeId: string,
    startDate: string,
    endDate: string
  ): Promise<Booking[]>;

  getUserBookings(email: string, date: string): Promise<Booking[]>;

  getUserNextBooking(email: string): Promise<Booking | null>;

  getUserNextBookings(email: string): Promise<Booking[]>;

  confirmPresence(bookingId: string): Promise<void>;

  /**
   * Get all bookings for a place after a date
   * @param placeId Place ID
   * @param startDate Format YYYYMMDD. This date should not be included in search
   */
  getPlaceBookingsAfterDate(
    placeId: string,
    startDate: string
  ): Promise<Booking[]>;
}
