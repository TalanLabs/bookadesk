import { BookingRepo } from "./ports/BookingRepo";
import { NotAuthorizedError } from "../domain/errors";
import { EmailGateway } from "./ports/EmailGateway";
import { parse, format } from "date-fns";

export const deleteBooking = async (
  bookingId: string,
  userEmail: string,
  isUserAdmin: boolean,
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway
): Promise<void> => {
  const booking = await bookingRepo.getBooking(bookingId);
  if (!booking) {
    return Promise.resolve();
  }
  if (booking.email != userEmail) {
    if (!isUserAdmin) {
      throw new NotAuthorizedError();
    }
    else {
       // if booking is deleted by another user who is admin, send an email to the booking's user
      const messageDate = format(parse(booking.date, 'yyyymmdd', new Date()), 'dd-mm-yyyy')
      emailGateway.sendEmail(
        userEmail,
        booking.email,
        `Your booking for the ${messageDate} canceled by admin`,
        `Hello,\n 
      Your booking planned for the ${messageDate} of the place ${booking.officeId} - ${booking.placeId} has been canceled by an administrator.\n 
      Contact your system admin for more information.\n 
      Regards, BookADesk`
      )
    }
  }
  return bookingRepo.deleteBooking(bookingId);
};
