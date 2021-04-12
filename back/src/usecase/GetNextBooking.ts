import { BookingDetails, Office, Place } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";
import { OfficeRepo } from "./ports/OfficeRepo";

export const getNextBooking = async (
  email: string,
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo
): Promise<BookingDetails | null> => {
  const nextBooking = await bookingRepo.getUserNextBooking(email);
  if (!nextBooking) {
    return null;
  }

  const place: Place = await officeRepo.getPlace(nextBooking.placeId);
  const office: Office = await officeRepo.getOffice(nextBooking.officeId);
  return { booking: nextBooking, place: place, office: office };
};
