import express from "express";
import { ConnectedUser } from "../../domain/domain";

export interface AuthenticatedRequest extends express.Request {
  kauth: {
    grant: {
      access_token: {
        content: {
          email;
        };
      };
    };
  };
}

export function sendUnexpectedError(res: express.Response): express.Response {
  return res.status(500).send({ message: "Unexpected server error" });
}

export function sendUnauthorizedError(res: express.Response): express.Response {
  return res.status(403).send({
    message: "The connected user is not allowed to perform this action"
  });
}

export function getConnectedUserFromReq(
  req: AuthenticatedRequest
): ConnectedUser {
  return getConnectedUser(req.kauth.grant.access_token.content);
}

export function getConnectedUser(userInfo: { email: string }): ConnectedUser {
  return { email: userInfo.email, isAdmin: isUserAdmin(userInfo) };
}

export const isUserAdmin = (userInfo): boolean => {
  return userInfo.resource_access["desk-booking-front"]?.roles?.includes(
    "admin"
  );
};
