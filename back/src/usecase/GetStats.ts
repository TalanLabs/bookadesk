import { OfficeRepo } from "./ports/OfficeRepo";
import { Office } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";

interface DayStats {
  date: string;
  officeId: string;
  bookings: number;
  confirmedBookings: number;
  places: number;
}

export const getStats = async (
  officeId: string,
  date: string,
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo
): Promise<DayStats> => {
  try {
    const office: Office = await officeRepo.getOffice(officeId);
    const officePlaces = await Promise.all(
      office.floors.map(f => officeRepo.getFloorPlaces(f.id))
    );
    const places = [].concat(...officePlaces);
    const bookings = await bookingRepo.getBookings(officeId, date);

    const placesNumber = places.length;
    const confirmedBookingsNumber = bookings.filter(b => b.confirmed).length;
    return {
      date,
      officeId,
      places: placesNumber,
      bookings: bookings.length,
      confirmedBookings: confirmedBookingsNumber
    };
  } catch (err) {
    console.error("Failed to get statistics. ", err);
    throw err;
  }
};
