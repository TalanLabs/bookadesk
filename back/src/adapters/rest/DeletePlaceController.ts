import { OfficeRepo } from "../../usecase/ports/OfficeRepo";
import { deletePlace } from "../../usecase/DeletePlace";
import { NotAuthorizedError } from "../../domain/errors";
import {
  AuthenticatedRequest,
  getConnectedUserFromReq,
  sendUnauthorizedError,
  sendUnexpectedError
} from "./RestUtils";
import express from "express";

export function deletePlaceController(officeRepo: OfficeRepo) {
  return async (
    req: AuthenticatedRequest,
    res: express.Response
  ): Promise<express.Response> => {
    const placeId = req.params.id as string;
    const connectedUser = getConnectedUserFromReq(req);

    try {
      await deletePlace(placeId, connectedUser, officeRepo);
      return res.status(201).send();
    } catch (e) {
      if (e instanceof NotAuthorizedError) {
        return sendUnauthorizedError(res);
      }
      console.error(`Failed to delete place ${placeId}`, e);
      return sendUnexpectedError(res);
    }
  };
}
