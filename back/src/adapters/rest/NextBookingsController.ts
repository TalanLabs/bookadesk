import { BookingRepo } from "../../usecase/ports/BookingRepo";
import express from "express";
import { AuthenticatedRequest, sendUnexpectedError } from "./RestUtils";
import { getNextBookings } from "../../usecase/GetNextBookings";

export function nextBookingsController(bookingRepo: BookingRepo) {
  return async (
    req: AuthenticatedRequest,
    res: express.Response
  ): Promise<void> => {
    try {
      const user = req.kauth.grant.access_token.content;
      const next = await getNextBookings(user.email, bookingRepo);
      res.status(200).send(next);
    } catch (error) {
      console.error(error);
      sendUnexpectedError(res);
    }
  };
}
