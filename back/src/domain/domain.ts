export interface Place {
  id: string;
  number: string;
  room?: string;
  description?: string;
  position?: {
    top?: number;
    left?: number;
  };
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
 * Maybe should not be in domain?
 */
export interface BookingDetails extends Booking {
  officeName: string;
  floorName: string;
  room?: string;
  placeDescription?: string;
  placeName: string;
}
