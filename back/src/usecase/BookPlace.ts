import { BookingRepo } from "./ports/BookingRepo";
import { Booking } from "../domain/domain";
import {
  DayAlreadyBookedError,
  PlaceAlreadyBookedError,
} from "../domain/errors";

export const bookPlace = async (
  booking: Booking,
  bookingRepo: BookingRepo
): Promise<void> => {
  const currentBookings = await bookingRepo.getBookings(
    booking.officeId,
    booking.date
  );
  const userBookings = await bookingRepo.getUserBookings(
    booking.email,
    booking.date
  );
  if (currentBookings.find((b) => b.placeId === booking.placeId)) {
    throw new PlaceAlreadyBookedError();
  }
  if (userBookings.length > 0) {
    throw new DayAlreadyBookedError();
  }
  return bookingRepo.bookPlace(booking);
};
