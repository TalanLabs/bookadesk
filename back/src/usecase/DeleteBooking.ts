import { BookingRepo } from "./ports/BookingRepo";
import { NotAuthorizedError, NotFoundError } from "../domain/errors";
import { EmailGateway } from "./ports/EmailGateway";
import { format, parse } from "date-fns";
import { Booking } from "../domain/domain";

export const deleteBooking = async (
  bookingId: string,
  userEmail: string,
  isUserAdmin: boolean,
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway
): Promise<void> => {
  const booking = await bookingRepo.getBooking(bookingId);
  if (!booking) {
    throw new NotFoundError();
  }
  if (!isUserAdmin) {
    throw new NotAuthorizedError();
  }
  if (booking.email !== userEmail) {
    sendNotificationEmail(booking, emailGateway);
  }
  return bookingRepo.deleteBooking(bookingId);
};

function sendNotificationEmail(booking: Booking, emailGateway: EmailGateway) {
  // If booking is deleted by another user who is admin, send an email to the booking's user
  const messageDate = format(
    parse(booking.date, "yyyymmdd", new Date()),
    "dd/mm/yyyy"
  );
  emailGateway.sendEmail(
    "bookadesk@talan.com",
    booking.email,
    `Your booking for ${messageDate} was canceled by admin`,
    `Hello,\n\nYour booking planned for ${messageDate} has been canceled by an administrator.\nContact your system administrator for more information.\n\nRegards,\nBookADesk`
  );
}
