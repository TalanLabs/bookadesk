import { ImageRepo } from "./ports/ImageRepo";

export const getFloorPlan = async (
  floorId: string,
  imageRepo: ImageRepo
): Promise<string> => {
  return imageRepo.getFloorPlan(floorId);
};
