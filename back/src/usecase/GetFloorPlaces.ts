import { OfficeRepo } from "./ports/OfficeRepo";
import { Place } from "../domain/domain";

export const getFloorPlaces = async (
  floorId: string,
  officeRepo: OfficeRepo
): Promise<Place[]> => {
  return officeRepo.getFloorPlaces(floorId);
};
