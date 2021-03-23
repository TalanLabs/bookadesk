export interface ImageRepo {
  uploadFloorPlan(floorId: string, image: File): Promise<void>
  getFloorPlan(floorId: string): Promise<void>
}
