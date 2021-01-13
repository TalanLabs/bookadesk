import { OfficeRepo } from "./ports/OfficeRepo";

export const updateFloorName = async (
  officeId: string,
  floorId: string,
  floorName: string,
  officeRepo: OfficeRepo
): Promise<void> => {
  return officeRepo.updateFloorName(officeId, floorId, floorName);
};
