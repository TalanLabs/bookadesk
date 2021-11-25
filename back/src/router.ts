import express, { Router } from "express";
import formidableMiddleware from "express-formidable";
import { deleteBooking } from "./usecase/DeleteBooking";
import {
  DayAlreadyBookedError,
  NotAuthorizedError,
  PlaceAlreadyBookedError
} from "./domain/errors";
import { confirmPresence } from "./usecase/ConfirmPresence";
import { getOffices } from "./usecase/GetOffices";
import { getOffice } from "./usecase/GetOffice";
import { updatePlaces } from "./usecase/UpdatePlaces";
import { getBookings } from "./usecase/GetBookings";
import { Booking } from "./domain/domain";
import { bookPlace } from "./usecase/BookPlace";
import { Keycloak } from "keycloak-connect";
import { BookingRepo } from "./usecase/ports/BookingRepo";
import { OfficeRepo } from "./usecase/ports/OfficeRepo";
import { getStats } from "./usecase/GetStats";
import { SuppliesRepo } from "./usecase/ports/SuppliesRepo";
import { notifyMissingSupplies } from "./usecase/NotifyMissingSupplies";
import { getMissingSupplies } from "./usecase/GetMissingSupplies";
import { createOrUpdateOffices } from "./usecase/CreateOrUpdateOffices";
import { saveFloorPlan } from "./usecase/SaveFloorPlan";
import { getFloorPlan } from "./usecase/GetFloorPlan";
import { ImageRepo } from "./usecase/ports/ImageRepo";
import { EmailGateway } from "./usecase/ports/EmailGateway";
import { nextBookingController } from "./adapters/rest/NextBookingController";
import { getFloorPlacesController } from "./adapters/rest/GetFloorPlacesController";
import {
  AuthenticatedRequest,
  isUserAdmin,
  sendUnexpectedError
} from "./adapters/rest/RestUtils";
import { updateFloorName } from "./usecase/updateFloorName";
import { deletePlaceController } from "./adapters/rest/DeletePlaceController";
import { TimeProvider } from "./usecase/ports/TimeProvider";
import { nextBookingsController } from "./adapters/rest/NextBookingsController";

function updatePlacesController(officeRepo: OfficeRepo) {
  return async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.kauth.grant.access_token.content;
      if (!isUserAdmin(user)) {
        return res.status(403).send({
          code: "NOT_AUTHORIZED",
          message: "Only admins can update an office"
        });
      }
      const office = await updatePlaces(
        req.body,
        req.params.officeId,
        req.params.floorId,
        officeRepo
      );
      console.info(`User ${user.email} updated floor ${req.params.floorId}`);
      return res.status(200).send(office);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function deleteBookingController(
  bookingRepo: BookingRepo,
  emailGateway: EmailGateway
) {
  return async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.kauth.grant.access_token.content;
      await deleteBooking(
        req.params.id,
        user.email,
        isUserAdmin(user),
        bookingRepo,
        emailGateway
      );
      return res.status(200).send({ message: "Booking deleted" });
    } catch (error) {
      console.log(error);
      if (error instanceof NotAuthorizedError) {
        return res.status(400).send({
          code: "NOT_AUTHORIZED",
          message: "User not authorized to delete this booking"
        });
      } else {
        console.log(error);
        return sendUnexpectedError(res);
      }
    }
  };
}

function confirmBookingController(bookingRepo: BookingRepo) {
  return async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.kauth.grant.access_token.content;
      const office = await confirmPresence(
        req.params.id,
        user.email,
        bookingRepo
      );
      return res.status(200).send(office);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function getOfficesController(officeRepo: OfficeRepo) {
  return async (req, res) => {
    try {
      const offices = await getOffices(officeRepo);
      return res.status(200).send(offices);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function getOfficeController(officeRepo: OfficeRepo) {
  return async (req, res) => {
    try {
      const office = await getOffice(req.params.id, officeRepo);
      return res.status(200).send(office);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function createOrUpdateOfficesController(officeRepo: OfficeRepo) {
  return async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.kauth.grant.access_token.content;
      if (!isUserAdmin(user)) {
        return res.status(403).send({
          code: "NOT_AUTHORIZED",
          message: "Only admins can update an office"
        });
      }
      const offices = await createOrUpdateOffices(req.body, officeRepo);
      console.info(
        `User ${user.email} created or updated offices ${req.body
          .map(o => o.id)
          .join(",")}`
      );
      return res.status(200).send(offices);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function getBookingsController(bookingRepo: BookingRepo) {
  return async (req, res) => {
    try {
      const officeId = req.params.id;
      const date: string = req.query.date as string;
      const bookings = await getBookings(officeId, date, bookingRepo);

      return res.status(200).send(bookings);
    } catch (error) {
      console.log(error);
      return sendUnexpectedError(res);
    }
  };
}

function bookPlaceController(bookingRepo: BookingRepo) {
  return async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.kauth.grant.access_token.content;
      const booking: Booking = {
        placeId: req.body.placeId,
        date: req.body.date,
        email: user.email,
        officeId: req.params.id
      };
      if (!booking.date || !booking.placeId || !booking.officeId) {
        return res
          .status(400)
          .send("Missing parameter date or placeId or officeId");
      }

      await bookPlace(booking, bookingRepo);

      return res.status(200).send("Booking successful");
    } catch (error) {
      if (error instanceof PlaceAlreadyBookedError) {
        return res.status(400).send({
          code: "PLACE_ALREADY_BOOKED",
          message: "This place has already been booked"
        });
      } else if (error instanceof DayAlreadyBookedError) {
        return res.status(400).send({
          code: "DAY_ALREADY_BOOKED",
          message: "User has already booked a place for this day"
        });
      } else {
        console.log(error);
        return sendUnexpectedError(res);
      }
    }
  };
}

function sendNotFoundError(res: express.Response, message: string) {
  return res.status(404).send({ message });
}

function notifyMissingSuppliesController(suppliesRepo: SuppliesRepo) {
  return async (req, res) => {
    try {
      await notifyMissingSupplies(
        {
          officeId: req.body.officeId,
          type: req.body.type,
          comments: req.body.comments
        },
        suppliesRepo
      );
      return res.send();
    } catch (e) {
      console.error("Failed to add missing supply notification", e);
      return sendUnexpectedError(res);
    }
  };
}

function statsController(bookingRepo: BookingRepo, officeRepo: OfficeRepo) {
  return async (req, res) => {
    try {
      const officeId = req.query.officeId as string;
      const date = req.query.date as string;
      if (!officeId || !date) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameters: date or officeId"
        });
      }
      const stats = await getStats(officeId, date, bookingRepo, officeRepo);
      return res.send(stats);
    } catch (e) {
      console.error("Failed to get stats", e);
      return sendUnexpectedError(res);
    }
  };
}

function getMissingSuppliesController(suppliesRepo: SuppliesRepo) {
  return async (req, res) => {
    try {
      const officeId = req.query.officeId as string;
      if (!officeId) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter officeId"
        });
      }
      const missingSupplies = await getMissingSupplies(officeId, suppliesRepo);
      return res.send(missingSupplies);
    } catch (e) {
      console.error("Failed to get stats", e);
      return sendUnexpectedError(res);
    }
  };
}

function uploadFloorPlan(imageRepo: ImageRepo) {
  return async (req, res) => {
    const floorId = req.params.floorId as string;
    const plan = req.files.file;
    try {
      if (!floorId) {
        const user = req.kauth.grant.access_token.content;
        if (!isUserAdmin(user)) {
          return res.status(403).send({
            code: "NOT_AUTHORIZED",
            message: "Only admins can update an office"
          });
        }
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter floorId"
        });
      }
      await saveFloorPlan(floorId, plan.path, imageRepo);
      return res.status(201).send();
    } catch (e) {
      console.error(`Failed to upload floor's plan for floorId=${floorId}`, e);
      return sendUnexpectedError(res);
    }
  };
}

function fetchFloorPlan(imageRepo: ImageRepo) {
  return async (req, res) => {
    const floorId = req.params.floorId as string;
    const officeId = req.params.officeId as string;
    try {
      if (!floorId) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter floorId"
        });
      }
      if (!officeId) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter officeId"
        });
      }
      const plan = await getFloorPlan(floorId, imageRepo);
      return res.status(200).send(plan);
    } catch (err) {
      if (err.statusCode && err.statusCode == 404) {
        return sendNotFoundError(res, `No plan found for floorId=${floorId}`);
      }
      console.error(`Failed to fetch floor's plan for floorId=${floorId}`, err);
      return sendUnexpectedError(res);
    }
  };
}

function updateFloorNameController(officeRepo: OfficeRepo) {
  return async (req, res) => {
    const floorId = req.params.floorId as string;
    const officeId = req.params.officeId as string;
    const { floorName } = req.body;
    try {
      const user = req.kauth.grant.access_token.content;
      if (!isUserAdmin(user)) {
        return res.status(403).send({
          code: "NOT_AUTHORIZED",
          message: "Only admins can update an office"
        });
      }
      if (!floorId) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter floorId"
        });
      }
      if (!officeId) {
        return res.status(400).send({
          code: "MISSING_PARAMETERS",
          message: "Missing query parameter offcieId"
        });
      }
      await updateFloorName(officeId, floorId, floorName, officeRepo);
      return res.status(201).send();
    } catch (e) {
      console.error(`Failed to update floor name with floorId=${floorId}`, e);
      return sendUnexpectedError(res);
    }
  };
}

export function createRoutes(
  keycloak: Keycloak,
  bookingRepo: BookingRepo,
  officeRepo: OfficeRepo,
  suppliesRepo: SuppliesRepo,
  imageRepo: ImageRepo,
  emailGateway: EmailGateway,
  timeProvider: TimeProvider
): Router {
  const router = express.Router();
  router.get(
    "/bookings/next",
    keycloak.protect(),
    nextBookingController(bookingRepo, officeRepo)
  );
  router.get(
    "/bookings/all-next",
    keycloak.protect(),
    nextBookingsController(bookingRepo)
  );
  router.get(
    "/bookings/stats",
    keycloak.protect(),
    statsController(bookingRepo, officeRepo)
  );
  router.delete(
    "/bookings/:id",
    keycloak.protect(),
    deleteBookingController(bookingRepo, emailGateway)
  );
  router.post(
    "/bookings/:id/confirm",
    keycloak.protect(),
    confirmBookingController(bookingRepo)
  );
  router.get("/offices", getOfficesController(officeRepo));
  router.get(
    "/offices/:id",
    keycloak.protect(),
    getOfficeController(officeRepo)
  );
  router.put(
    "/offices",
    keycloak.protect(),
    createOrUpdateOfficesController(officeRepo)
  );
  router.put(
    "/offices/:officeId/floors/:floorId/places",
    keycloak.protect(),
    updatePlacesController(officeRepo)
  );
  router.delete(
    "/places/:id",
    keycloak.protect(),
    deletePlaceController(officeRepo, bookingRepo, emailGateway, timeProvider)
  );
  router.get(
    "/offices/:id/bookings",
    keycloak.protect(),
    getBookingsController(bookingRepo)
  );
  router.post(
    "/offices/:id/book",
    keycloak.protect(),
    bookPlaceController(bookingRepo)
  );
  router.get(
    "/supplies",
    keycloak.protect(),
    getMissingSuppliesController(suppliesRepo)
  );
  router.post(
    "/supplies/notify",
    keycloak.protect(),
    notifyMissingSuppliesController(suppliesRepo)
  );
  router.post(
    "/offices/:officeId/floors/:floorId/plan",
    keycloak.protect(),
    formidableMiddleware(),
    uploadFloorPlan(imageRepo)
  );
  router.get(
    "/offices/:officeId/floors/:floorId/plan",
    keycloak.protect(),
    fetchFloorPlan(imageRepo)
  );
  router.get(
    "/offices/:officeId/floors/:floorId/places",
    keycloak.protect(),
    getFloorPlacesController(officeRepo)
  );
  router.put(
    "/offices/:officeId/floors/:floorId/name",
    keycloak.protect(),
    updateFloorNameController(officeRepo)
  );

  return router;
}
