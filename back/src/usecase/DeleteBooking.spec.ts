// import { BookingRepo } from "./ports/BookingRepo"
// import { deleteBooking } from "./DeleteBooking"
// import { EmailGateway } from "./ports/EmailGateway"

import { InMemoryBookingRepo } from "../adapters/InMemoryBookingRepo";
import { Booking } from "../domain/domain";
import { NotAuthorizedError } from "../domain/errors";
import { deleteBooking } from "./DeleteBooking";
import { BookingRepo } from "./ports/BookingRepo";
import { EmailGateway } from "./ports/EmailGateway";

describe("DeleteBooking", () => {
  // Init data for the tests
  const mockBookingRepo: BookingRepo = new InMemoryBookingRepo();
  const mockSendEmail = jest.fn().mockName("sendEmail");
  const mockEmailGateway: EmailGateway = {
    sendEmail: mockSendEmail
  };
  const booking: Booking = {
    id: "123",
    date: "20210128",
    email: "normal-user@mail.com",
    placeId: "place_1",
    officeId: "office_1",
    confirmed: true
  };
  test("should not send an email if user deletes its own booking", async () => {
    // GIVEN
    const isAdmin = true;
    const userEmail = booking.email;

    // WHEN
    await deleteBooking(
      booking.id,
      userEmail,
      isAdmin,
      mockBookingRepo,
      mockEmailGateway
    );

    // THEN
    expect(mockEmailGateway.sendEmail).toBeCalledTimes(0);
  });
  test("should send an email to booking's user when admin deletes its booking", async () => {
    // GIVEN
    const isAdmin = true;
    const userEmail = "admin-user@mail.com";

    // WHEN
    await deleteBooking(
      booking.id,
      userEmail,
      isAdmin,
      mockBookingRepo,
      mockEmailGateway
    );

    // THEN
    expect(mockEmailGateway.sendEmail).toHaveBeenCalled();
  });

  test("should throw error if deleting user is nor admin nor booking's user", async () => {
    // GIVEN
    const isAdmin = false;
    const userEmail = "not-admin-user@mail.com";

    // WHEN
    await expect(
      deleteBooking(
        booking.id,
        userEmail,
        isAdmin,
        mockBookingRepo,
        mockEmailGateway
      )
    )
      .rejects // THEN
      .toThrow(NotAuthorizedError);
  });
});
