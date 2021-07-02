export class PlaceAlreadyBookedError extends Error {
  constructor(message?: string) {
    super(message || "This place is already booked");
  }
}
export class DayAlreadyBookedError extends Error {
  constructor(message?: string) {
    super(message || "User has already booked a place for this day");
  }
}
export class NotAuthorizedError extends Error {
  constructor(user?: string) {
    super(`User ${user} is not allowed to do this action`);
  }
}
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || "The requested object was not found");
  }
}
