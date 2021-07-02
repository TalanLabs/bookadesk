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
import { BookingRepo } from "../../usecase/ports/BookingRepo";
import { EmailGateway } from "../../usecase/ports/EmailGateway";
import { TimeProvider } from "../../usecase/ports/TimeProvider";

export function deletePlaceController(
  officeRepo: OfficeRepo,
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway,
  timeProvider: TimeProvider
) {
  return async (
    req: AuthenticatedRequest,
    res: express.Response
  ): Promise<express.Response> => {
    const placeId = req.params.id;
    const connectedUser = getConnectedUserFromReq(req);

    try {
      await deletePlace(
        placeId,
        connectedUser,
        officeRepo,
        bookingRepo,
        emailGateway,
        timeProvider
      );
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
