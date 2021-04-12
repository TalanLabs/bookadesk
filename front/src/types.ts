export interface Booking {
  id: string;
  officeId: string;
  placeId: string;
  date: string;
  email?: string;
}

export interface BookingDetails {
  id: string;
  officeName: string;
  floorName: string;
  placeName: string;
  date: string;
  email?: string;
}

export interface Place {
  id: string;
  number: string;
}

export interface Floor {
  name: string;
  id: string;
  places: Place[];
}

export interface Office {
  name: string;
  description?: string;
  id: string;
  floors: Floor[];
}

export interface DayStats {
  date: string;
  officeId: string;
  bookings: number;
  confirmedBookings: number;
  places: number;
}

export class PlaceAlreadyBookedError extends Error {}

export class DayAlreadyBookedError extends Error {}
