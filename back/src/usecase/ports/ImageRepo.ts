export interface ImageRepo {
  uploadFloorPlan(floorId: string, imagePath: string): Promise<void>;
  getFloorPlan(floorId: string): Promise<string>;
}
