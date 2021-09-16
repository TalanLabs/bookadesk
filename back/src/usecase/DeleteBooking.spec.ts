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
  async function initTest() {
    const bookingRepo: BookingRepo = new InMemoryBookingRepo();
    const sendEmail = jest.fn().mockName("sendEmail");
    const mockEmailGateway: EmailGateway = {
      sendEmail: sendEmail
    };
    const booking: Booking = {
      id: "123",
      date: "20210128",
      email: "normal-user@mail.com",
      placeId: "place_1",
      officeId: "office_1",
      confirmed: true
    };
    await bookingRepo.bookPlace(booking);
    return { bookingRepo, mockEmailGateway, booking };
  }

  test("should not send an email if user deletes its own booking", async () => {
    // GIVEN
    const { bookingRepo, mockEmailGateway, booking } = await initTest();

    // WHEN
    await deleteBooking(
      booking.id,
      booking.email,
      false,
      bookingRepo,
      mockEmailGateway
    );

    // THEN
    const deletedBooking = await bookingRepo.getBooking(booking.id);
    expect(deletedBooking).toBeUndefined();
    expect(mockEmailGateway.sendEmail).toBeCalledTimes(0);
  });

  test("a non admin should not be able to delete a place booked by another user", async () => {
    // GIVEN
    const { bookingRepo, mockEmailGateway, booking } = await initTest();

    // WHEN
    try {
      await deleteBooking(
        booking.id,
        "other-user@talan.com",
        false,
        bookingRepo,
        mockEmailGateway
      );
    } catch (e) {
      // THEN
      expect(e).toBeInstanceOf(NotAuthorizedError);
    }

    expect(mockEmailGateway.sendEmail).toBeCalledTimes(0);
  });

  test("should send an email to booking's user when admin deletes its booking", async () => {
    // GIVEN
    const { bookingRepo, mockEmailGateway, booking } = await initTest();

    // WHEN
    await deleteBooking(
      booking.id,
      "admin-user@mail.com",
      true,
      bookingRepo,
      mockEmailGateway
    );

    // THEN
    expect(mockEmailGateway.sendEmail).toHaveBeenCalled();
  });

  test("should throw error if deleting user is nor admin nor booking's user", async () => {
    // GIVEN
    const { bookingRepo, mockEmailGateway, booking } = await initTest();

    // WHEN
    await expect(
      deleteBooking(
        booking.id,
        "not-admin-user@mail.com",
        false,
        bookingRepo,
        mockEmailGateway
      )
    )
      .rejects // THEN
      .toThrow(NotAuthorizedError);
  });
});
