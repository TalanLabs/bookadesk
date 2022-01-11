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

export interface FloorStats {
  floorId: string;
  floorName: string;
  bookingsNumber: number;
  placesNumber: number;
}

export interface OfficeStats {
  officeId: string;
  officeName: string;
  bookingsNumber: number;
  placesNumber: number;
  floors: FloorStats[];
}

export interface UserStats {
  bookingsNumber: number;
  email: string;
}

export interface BookingStats {
  startDate: string;
  endDate: string;
  totalBookings: number;
  totalPlaces: number;
  offices: OfficeStats[];
  users: UserStats[];
}

export interface MissingSupply {
  id?: string;
  comments: string;
  officeId: string;
  type: string;
  createdAt?: number;
}

export class PlaceAlreadyBookedError extends Error {}

export class DayAlreadyBookedError extends Error {}

export interface MissingSupply {
  id?: string;
  comments: string;
  officeId: string;
  type: string;
  createdAt?: number;
}
