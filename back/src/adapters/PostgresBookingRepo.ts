// import {Client} from "pg"
// import {v4 as uuid} from "uuid";
//
// import {BookingRepo} from "../usecase/ports/BookingRepo";
// import {Booking} from "../domain/domain";
// import {format} from "date-fns";
//
// export class PostgresBookingRepo implements BookingRepo {
//     bookings: Map<string, Booking[]> = new Map();
//     private client;
//
//     constructor(client: Client) {
//         this.client = client;
//     }
//
//     bookPlace = async (booking: Booking): Promise<void> => {
//         const text =
//             "INSERT INTO bookings(id, date, email, place_id) VALUES($1, $2, $3, $4) RETURNING *";
//         const values = [uuid(), booking.date, booking.email, booking.placeId];
//         try {
//             await this.client.query(text, values);
//         } catch (err) {
//             console.error("failed to add places", err.stack);
//         }
//     };
//
//     async getBookings(officeId: string, date: string): Promise<Booking[]> {
//         const text =
//             "SELECT * FROM places LEFT JOIN bookings ON places.id = bookings.place_id where places.office_id = $1 and bookings.date = $2";
//         const values = [officeId, date];
//         try {
//             const res = await this.client.query(text, values);
//             return res.rows.map((r) => this.bookingFromDb(r));
//         } catch (err) {
//             console.error("failed to get bookings", err.stack);
//         }
//     }
//
//     async getBookingByPlaceId(placeId: string): Promise<Booking[]> {
//         const text =
//             "SELECT * FROM bookings  where bookings.place_id = $1 ";
//         const values = [placeId];
//         try {
//             const res = await this.client.query(text, values);
//             return res.rows.map((r) => this.bookingFromDb(r));
//         } catch (err) {
//             console.error("failed to get bookings", err.stack);
//         }
//     }
//
//     async getOfficeBookingCount(
//         officeId: string,
//         startDate: string,
//         endDate: string
//     ): Promise<OfficeDayStats[]> {
//         const query = `
//             SELECT bookings.date, count(*) as count
//             FROM places
//                      LEFT JOIN bookings ON places.id = bookings.place_id
//             where places.office_id = $1
//               and bookings.date between $2 and $3
//             group by date
//             ORDER BY date`;
//         const values = [officeId, startDate, endDate];
//         try {
//             const res = await this.client.query(query, values);
//             return res.rows.map((r) => {
//                 return {
//                     date: r.date,
//                     bookedPlaces: r.count,
//                 };
//             });
//         } catch (err) {
//             console.error("failed to get booking count", err.stack);
//         }
//     }
//
//     async getFloorsBookingCount(
//         officeId: string,
//         startDate: string,
//         endDate: string
//     ): Promise<FloorDayStats[]> {
//         const query = `
//             SELECT places.floor_id, bookings.date, count(*) as count
//             FROM places
//                      LEFT JOIN bookings ON places.id = bookings.place_id
//             where places.office_id = $1
//               and bookings.date between $2 and $3
//             group by floor_id, date
//             ORDER BY floor_id, date`;
//         const values = [officeId, startDate, endDate];
//         try {
//             const res = await this.client.query(query, values);
//             return res.rows.map((r) => {
//                 return {
//                     date: r.date,
//                     bookedPlaces: r.count,
//                     floorId: r.floor_id,
//                 };
//             });
//         } catch (err) {
//             console.error("failed to get booking count", err.stack);
//         }
//     }
//
//     bookingFromDb(d: any): Booking {
//         return {
//             id: d.id,
//             date: d.date,
//             placeId: d.place_id,
//             email: d.email,
//             officeId: d.office_id,
//             confirmed: d.confirmed,
//         };
//     }
//
//     async getUserBookings(email: string, date: string): Promise<Booking[]> {
//         const text =
//             "SELECT * FROM bookings where bookings.email = $1 and bookings.date = $2";
//         const values = [email, date];
//         try {
//             const res = await this.client.query(text, values);
//             return res.rows.map((r) => this.bookingFromDb(r));
//         } catch (err) {
//             console.error("failed to get user bookings", err.stack);
//         }
//     }
//
//     async getUserNextBooking(email: string): Promise<Booking | null> {
//         const today = format(new Date(), "yyyyMMdd");
//         const text =
//             "SELECT * FROM bookings where bookings.email = $1 and bookings.date >= $2";
//         const values = [email, today];
//         try {
//             const res = await this.client.query(text, values);
//             let bookings: Booking[] = res.rows.map((r) => this.bookingFromDb(r));
//             bookings = bookings.sort((a, b) => parseInt(a.date) - parseInt(b.date));
//             return bookings[0];
//         } catch (err) {
//             console.error("failed to get user next bookings", err.stack);
//         }
//     }
//
//     async deleteBooking(bookingId): Promise<void> {
//         const text = "DELETE FROM bookings where bookings.id = $1";
//         const values = [bookingId];
//         try {
//             const res = await this.client.query(text, values);
//         } catch (err) {
//             console.error("failed to delete booking", err.stack);
//         }
//     }
//
//     async getBooking(bookingId): Promise<Booking> {
//         const text = "SELECT * FROM bookings where bookings.id = $1";
//         const values = [bookingId];
//         try {
//             const res = await this.client.query(text, values);
//             return res.rows.map((r) => this.bookingFromDb(r))[0];
//         } catch (err) {
//             console.error("failed to get one booking", err.stack);
//         }
//     }
//
//     async confirmPresence(bookingId: string): Promise<void> {
//         const text = "UPDATE bookings SET confirmed = true where bookings.id = $1";
//         const values = [bookingId];
//         try {
//             const res = await this.client.query(text, values);
//         } catch (err) {
//             console.error("failed to confirm booking", err.stack);
//         }
//     }
//
// }
