import { InMemoryBookingRepo } from "../adapters/InMemoryBookingRepo";
import { Booking } from "../domain/domain";
import {
  DayAlreadyBookedError,
  PlaceAlreadyBookedError
} from "../domain/errors";
import { BookingRepo } from "./ports/BookingRepo";
import { bookPlace } from "./BookPlace";

describe("Book place", () => {
  // Init data for the tests
  const booking: Booking = {
    id: "1",
    date: "20210128",
    email: "normal-user@test.com",
    placeId: "place_1",
    officeId: "office_1",
    confirmed: false
  };

  test("should not allow booking twice the same place for same day", async () => {
    // GIVEN
    const bookingRepo: BookingRepo = new InMemoryBookingRepo();
    await bookPlace(booking, bookingRepo);
    const secondBooking: Booking = {
      id: "2",
      date: "20210128",
      email: "other-user@test.com",
      placeId: "place_1",
      officeId: "office_1",
      confirmed: false
    };
    bookingRepo.bookPlace = jest.fn();

    // WHEN
    await expect(bookPlace(secondBooking, bookingRepo))
      .rejects // THEN
      .toThrow(PlaceAlreadyBookedError);
    expect(bookingRepo.bookPlace).not.toHaveBeenCalled();
  });

  test("should not allow booking two places for same day", async () => {
    // GIVEN
    const bookingRepo: BookingRepo = new InMemoryBookingRepo();
    await bookPlace(booking, bookingRepo);
    const secondBooking: Booking = {
      id: "2",
      date: "20210128",
      email: "normal-user@test.com",
      placeId: "place_2",
      officeId: "office_1",
      confirmed: false
    };
    bookingRepo.bookPlace = jest.fn();

    // WHEN
    await expect(bookPlace(secondBooking, bookingRepo))
      .rejects // THEN
      .toThrow(DayAlreadyBookedError);
    expect(bookingRepo.bookPlace).not.toHaveBeenCalled();
  });
});
