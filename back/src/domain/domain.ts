export interface Place {
  id: string;
  number: string;
  room?: string;
  description?: string;
  position?: {
    top?: number;
    left?: number;
  };
  floorId: string;
  officeId: string;
}

export interface Floor {
  name: string;
  id: string;
}

export interface Office {
  name: string;
  description?: string;
  id: string;
  floors: Floor[];
}

/**
 * FR: Réservation
 */
export interface Booking {
  id?: string;
  /**
   * Date format: YYYYMMDD
   * Example: May, 15th 2020 is 20200515
   */
  date: string;
  email: string;
  placeId: string;
  officeId: string;
  confirmed?: boolean;
}

export interface MissingSupply {
  id?: string;
  comments: string;
  officeId: string;
  type: string;
  createdAt?: number;
}

/**
 * Bookings with details
 */
export interface BookingDetails {
  booking: Booking;
  office: Office;
  place: Place;
}

export interface ConnectedUser {
  email: string;
  isAdmin: boolean;
}
