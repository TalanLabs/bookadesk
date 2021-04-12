import { OfficeRepo } from "../../usecase/ports/OfficeRepo";
import express from "express";
import { getFloorPlaces } from "../../usecase/GetFloorPlaces";
import { AuthenticatedRequest, sendUnexpectedError } from "./RestUtils";

export function getFloorPlacesController(officeRepo: OfficeRepo) {
  return async (
    req: AuthenticatedRequest,
    res: express.Response
  ): Promise<void> => {
    try {
      const floorId = req.params.floorId;
      const places = await getFloorPlaces(floorId, officeRepo);
      res.status(200).send(places);
    } catch (error) {
      console.error(error);
      sendUnexpectedError(res);
    }
  };
}
