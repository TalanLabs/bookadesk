import { BookingRepo } from "../../usecase/ports/BookingRepo";
import { OfficeRepo } from "../../usecase/ports/OfficeRepo";
import { getNextBooking } from "../../usecase/GetNextBooking";
import express from "express";
import { AuthenticatedRequest, sendUnexpectedError } from "./RestUtils";

/**
 * export interface BookingDetails {
  id: string;
  officeName: string;
  floorName: string;
  placeName: string;
  date: string;
  email?: string;
}
 * @param bookingRepo
 * @param officeRepo
 */

export function nextBookingController(
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo
) {
  return async (
    req: AuthenticatedRequest,
    res: express.Response
  ): Promise<void> => {
    try {
      const user = req.kauth.grant.access_token.content;
      const next = await getNextBooking(user.email, bookingRepo, officeRepo);
      const floorName = next.office.floors.find(
        f => f.id === next.place.floorId
      ).name;
      res.status(200).send({
        id: next.booking.id,
        officeName: next.office.name,
        floorName: floorName,
        placeName: next.place.number,
        date: next.booking.date,
        email: next.booking.email
      });
    } catch (error) {
      console.error(error);
      sendUnexpectedError(res);
    }
  };
}
