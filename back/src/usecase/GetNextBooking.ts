import { Booking, BookingDetails } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";
import { OfficeRepo } from "./ports/OfficeRepo";
import { getOffice } from "./GetOffice";

export const getNextBooking = async (
  email: string,
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo
): Promise<BookingDetails | null> => {
  const nextBooking = await bookingRepo.getUserNextBooking(email);
  if (!nextBooking) {
    return null;
  }
  const placeDetails = await getPlaceDetails(nextBooking, officeRepo);
  return { ...nextBooking, ...placeDetails };
};

const getPlaceDetails = async (
  nextBooking: Booking,
  officeRepo: OfficeRepo
) => {
  const office = await officeRepo.getOffice(nextBooking.officeId);
  for (const floor of office.floors) {
    for (const place of floor.places) {
      if (place.id === nextBooking.placeId) {
        return {
          officeName: office.name,
          floorName: floor.name,
          room: place.room,
          placeName: place.number,
        };
      }
    }
  }
};
