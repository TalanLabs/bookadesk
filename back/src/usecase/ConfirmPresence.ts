import { BookingRepo } from "./ports/BookingRepo";
import { NotAuthorizedError } from "../domain/errors";
import { format } from "date-fns";

export const confirmPresence = async (
  bookingId: string,
  userEmail: string,
  bookingRepo: BookingRepo
): Promise<void> => {
  const booking = await bookingRepo.getBooking(bookingId);
  if (!booking) {
    throw new Error("Not found");
  }
  if (userEmail !== booking.email) {
    throw new NotAuthorizedError();
  }
  const todayString = format(Date.now(), "yyyyMMdd");
  if (todayString !== booking.date) {
    throw new NotAuthorizedError();
  }
  if (booking.date) {
  }
  await bookingRepo.confirmPresence(bookingId);
};
