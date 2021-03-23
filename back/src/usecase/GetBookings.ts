import { Booking } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";

export const getBookings = async (
  officeId: string,
  date: string,
  bookingRepo: BookingRepo
): Promise<Booking[]> => {
  return bookingRepo.getBookings(officeId, date);
};
