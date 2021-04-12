import express from "express";

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

export function sendUnexpectedError(res: express.Response): void {
  res.status(500).send({ message: "Unexpected server error" });
}
