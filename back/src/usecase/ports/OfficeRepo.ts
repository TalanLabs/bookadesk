import { Office, Place } from "../../domain/domain";

export interface OfficeRepo {
  getOffices(): Promise<Office[]>;

  getOffice(officeId: string): Promise<Office>;

  updatePlaces(
    places: Place[],
    officeId: string,
    floorId: string
  ): Promise<void>;

  /**
   * Create or update an office and its floors
   * @param offices
   * @param saveFloors
   */
  createOrUpdateOffices(offices: Office[], saveFloors: boolean): Promise<void>;

  updateFloorName(
    officeId: string,
    floorId: string,
    floorName: string
  ): Promise<void>;

  getPlace(placeId: string): Promise<Place>;

  getFloorPlaces(floorId: string): Promise<Place[]>;
}
