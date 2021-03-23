import { BookingRepo } from "./ports/BookingRepo";
import { NotAuthorizedError } from "../domain/errors";

export const deleteBooking = async (
  bookingId: string,
  userEmail: string,
  isUserAdmin: boolean,
  bookingRepo: BookingRepo
): Promise<void> => {
  const booking = await bookingRepo.getBooking(bookingId);
  if (!booking) {
    return Promise.resolve();
  }
  if (!isUserAdmin && booking.email !== userEmail) {
    throw new NotAuthorizedError();
  }
  return bookingRepo.deleteBooking(bookingId);
};
