import { Floor, Office, Place } from "../../domain/domain";

export interface OfficeRepo {
  getOffices(): Promise<Office[]>;

  getOffice(officeId: string): Promise<Office>;

  updatePlaces(places: Place[], officeId: string, floorId: string): Promise<void>;

  createOrUpdateOffices(offices: Office[], saveFloors: boolean): Promise<void>;

  updateFloorName(officeId: string, floorId: string, floorName: string): Promise<void>;
}
