import { ImageRepo } from "./ports/ImageRepo";

export const saveFloorPlan = async (
  floorId: string,
  imagePath: string,
  imageRepo: ImageRepo
): Promise<void> => {
  return imageRepo.uploadFloorPlan(floorId, imagePath);
};
