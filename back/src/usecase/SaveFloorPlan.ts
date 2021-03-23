import { ImageRepo } from "./ports/ImageRepo";

export const saveFloorPlan = async (
    floorId: string,
    image: File,
    imageRepo: ImageRepo
): Promise<void> => {
    return imageRepo.uploadFloorPlan(floorId, image)
};