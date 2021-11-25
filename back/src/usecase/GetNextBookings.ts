import { Booking } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";

export const getNextBookings = async (
  email: string,
  bookingRepo: BookingRepo
): Promise<Booking[]> => {
  const nextBookings = await bookingRepo.getUserNextBookings(email);
  if (!nextBookings) {
    return [];
  }
  return nextBookings;
};
