import { OfficeRepo } from "./ports/OfficeRepo";
import { Booking, Office, Place } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";

interface FloorStats {
  floorId: string;
  floorName: string;
  bookingsNumber: number;
  placesNumber: number;
}

interface OfficeStats {
  officeId: string;
  officeName: string;
  bookingsNumber: number;
  placesNumber: number;
  floors: FloorStats[];
}

interface UserStats {
  bookingsNumber: number;
  email: string;
}

interface BookingStats {
  startDate: string;
  endDate: string;
  totalBookings: number;
  totalPlaces: number;
  offices: OfficeStats[];
  users: UserStats[];
}

interface StatsCount {
  bookings: number;
  places: number;
}

/**
 * We maybe could add floorId to the booking (denormalize) to facilitate stats computing...
 */
export const getStats = async (
  offices: string[],
  startDate: string,
  endDate: string,
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo
): Promise<BookingStats> => {
  try {
    const officesStats: OfficeStats[] = [];
    const userMap: Map<string, number> = new Map();
    for (const officeId of offices) {
      console.log("office id", officeId);
      const office: Office = await officeRepo.getOffice(officeId);
      const officePlacesArray: Place[][] = await Promise.all(
        office.floors.map(f => officeRepo.getFloorPlaces(f.id))
      );
      const officePlaces = [].concat(...officePlacesArray);
      const bookings: Booking[] = await bookingRepo.getAllBookings(
        officeId,
        startDate,
        endDate
      );
      bookings.forEach(b =>
        userMap.set(b.email, (userMap.get(b.email) || 0) + 1)
      );

      const floorPlaces = groupBy(officePlaces, p => p.floorId);
      const floorStatsMap: Map<string, FloorStats> = new Map();

      for (const floor of office.floors) {
        floorStatsMap.set(floor.id, {
          bookingsNumber: 0,
          floorName: floor.name,
          floorId: floor.id,
          placesNumber: Array.from(floorPlaces.get(floor.id) || []).length
        });
      }
      for (const booking of bookings) {
        const place: Place = officePlaces.find(p => p.id === booking.placeId);
        if (!place) {
          console.error("did not find place for booking", booking.id);
          continue;
        }
        const floorStats = floorStatsMap.get(place.floorId);
        floorStatsMap.set(place.floorId, {
          ...floorStats,
          bookingsNumber: floorStats.bookingsNumber + 1
        });
      }

      const officeStats: OfficeStats = {
        placesNumber: officePlaces.length,
        bookingsNumber: bookings.length,
        officeName: office.name,
        officeId: officeId,
        floors: Array.from(floorStatsMap.values())
      };
      officesStats.push(officeStats);
    }

    const userStats: UserStats[] = [];
    for (const [email, bookings] of userMap) {
      userStats.push({ email: email, bookingsNumber: bookings });
    }

    const { bookings, places } = officesStats.reduce<StatsCount>(
      (previousValue, currentValue) => {
        return {
          bookings: currentValue.bookingsNumber + previousValue.bookings,
          places: currentValue.placesNumber + previousValue.places
        };
      },
      { bookings: 0, places: 0 }
    );

    return {
      startDate,
      endDate,
      totalBookings: bookings,
      totalPlaces: places,
      users: userStats,
      offices: officesStats
    };
  } catch (err) {
    console.error("Failed to get statistics. ", err);
    throw err;
  }
};

function removeDuplicates<T>(data: T[]): T[] {
  return [...new Set(data)];
}

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
