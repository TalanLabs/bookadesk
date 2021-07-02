import { NotAuthorizedError } from "../domain/errors";
import { Booking, ConnectedUser } from "../domain/domain";
import { OfficeRepo } from "./ports/OfficeRepo";
import { BookingRepo } from "./ports/BookingRepo";
import { sendCanceledBookingEmail } from "./DeleteBooking";
import { EmailGateway } from "./ports/EmailGateway";
import { TimeProvider } from "./ports/TimeProvider";

function cancelBooking(
  booking: Booking,
  connectedUserEmail: string,
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway
) {
  if (booking.email !== connectedUserEmail) {
    sendCanceledBookingEmail(booking, emailGateway);
  }
  console.info(
    `Cancelling booking ${booking.id} because place is deleted by user ${connectedUserEmail}`
  );
  return bookingRepo.deleteBooking(booking.id);
}

/**
 * Delete a place, all future bookings (starting next day) are canceled.
 * The users are notified by email
 * @throws NotAuthorizedError if user is not authorized
 */
export const deletePlace = async (
  placeId: string,
  connectedUser: ConnectedUser,
  officeRepo: OfficeRepo,
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway,
  timeProvider: TimeProvider
): Promise<void> => {
  if (!connectedUser.isAdmin) {
    throw new NotAuthorizedError();
  }
  console.info(`Place ${placeId} deleted by user ${connectedUser.email}`);
  const today = timeProvider.today();
  const bookings = await bookingRepo.getPlaceBookingsAfterDate(placeId, today);
  await Promise.all(
    bookings.map(b =>
      cancelBooking(b, connectedUser.email, bookingRepo, emailGateway)
    )
  );
  await officeRepo.deletePlace(placeId);
};
