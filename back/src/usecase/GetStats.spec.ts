import { v4 as uuid } from "uuid";
import { InMemoryBookingRepo } from "../adapters/InMemoryBookingRepo";
import { Booking } from "../domain/domain";
import { BookingRepo } from "./ports/BookingRepo";
import { getStats } from "./GetStats";
import { InMemoryOfficeRepo } from "../adapters/InMemoryOfficeRepo";

describe("GetStats", () => {
  const officeId = "paris_office";
  const testDate = "20210628";

  // Init data for the tests
  async function initTest() {
    const bookingRepo: BookingRepo = new InMemoryBookingRepo();
    const booking: Booking = {
      id: "123",
      date: testDate,
      email: "normal-user@mail.com",
      placeId: "place_1",
      officeId: "paris_office",
      confirmed: true
    };
    await bookingRepo.bookPlace(booking);

    const officeRepo = new InMemoryOfficeRepo();

    return { bookingRepo, officeRepo };
  }

  test("should get stats for one booked place", async () => {
    // GIVEN
    const { bookingRepo, officeRepo } = await initTest();
    // WHEN
    const dayStats = await getStats(
      [officeId],
      testDate,
      testDate,
      bookingRepo,
      officeRepo
    );

    // THEN
    expect(dayStats).toBeDefined();
    expect(dayStats.totalPlaces).toEqual(2);
    expect(dayStats.totalBookings).toEqual(1);
  });

  test("should get stats for two booked places in two places office", async () => {
    // GIVEN
    const { bookingRepo, officeRepo } = await initTest();
    const booking: Booking = {
      id: uuid(),
      date: testDate,
      email: "other-user@test.com",
      placeId: "place_2",
      officeId: "paris_office",
      confirmed: false
    };
    await bookingRepo.bookPlace(booking);
    // WHEN
    const dayStats = await getStats(
      [officeId],
      testDate,
      testDate,
      bookingRepo,
      officeRepo
    );

    // THEN
    expect(dayStats).toBeDefined();
    expect(dayStats.totalPlaces).toEqual(2);
    expect(dayStats.totalBookings).toEqual(2);
  });
});
