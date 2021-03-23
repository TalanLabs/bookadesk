import { ImageRepo } from "./ports/ImageRepo";

export const getFloorPlan = async (
    floorId: string,
    imageRepo: ImageRepo
): Promise<void> => {
    return imageRepo.getFloorPlan(floorId)
};