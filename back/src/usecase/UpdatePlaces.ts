import { OfficeRepo } from "./ports/OfficeRepo";
import { Place } from "../domain/domain";

export const updatePlaces = async (
  places: Place[],
  officeId: string,
  floorId: string,
  officeRepo: OfficeRepo
): Promise<void> => {
  return officeRepo.updatePlaces(places, officeId, floorId);
};
