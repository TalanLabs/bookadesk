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

  /**
   * Delete a place
   *
   * Should do nothing if place does not exists, or has already been removed.
   * This should be a soft delete, so that we can delete a place even when it has been booked.
   * We want to be able to remove a place and still see when it was occupied, and by whom.
   */
  deletePlace(placeId: string): Promise<void>;
}
