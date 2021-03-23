import Vue from "vue";
import Vuex, { ActionContext } from "vuex";
import {
  bookPlace,
  confirmPresence,
  deleteBooking,
  getBookings,
  getNextBooking,
  getOffices,
  saveOffices
} from "@/services";
import { Booking, Floor, Office } from "@/types";

Vue.use(Vuex);

interface StateModel {
  currentUser: {};
  offices: Office[];
  officesToSave: string[];
  bookings: Record<string, Booking>;
  isUserAdmin: boolean;
  nextBooking: Booking | undefined;
  selectedOfficeId: string;
  selectedDate: string;
}

export default new Vuex.Store<StateModel>({
  state: {
    currentUser: {},
    offices: [],
    officesToSave: [],
    /**
     * Booking by place
     */
    bookings: {},
    isUserAdmin: false,
    nextBooking: undefined,
    selectedOfficeId: "dumont_durville",
    selectedDate: ""
  },
  getters: {
    currentUser: state => {
      return state.currentUser;
    },
    booking: state => (placeId: string, date: string) => {
      return state.bookings[`${placeId}-${date}`];
    },
    nextBooking: state => {
      return state.nextBooking;
    },
    selectedOffice: state => {
      return state.selectedOfficeId;
    },
    selectedDate: state => {
      return state.selectedDate;
    },
    offices: state => {
      return state.offices;
    }
  },
  mutations: {
    confirmBooking(state, bookingId) {
      if (state.nextBooking && state.nextBooking.id === bookingId) {
        Vue.set(state.nextBooking, "confirmed", true);
      }
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setBookings(state, bookings) {
      state.bookings = {};
      for (const booking of bookings) {
        Vue.set(state.bookings, `${booking.placeId}-${booking.date}`, booking);
      }
    },
    setOffices(state, offices) {
      state.offices = offices;
    },
    addOffice(state: StateModel, office: Office) {
      state.offices.push(office);
    },
    setOfficeToSave(state: StateModel, officeId: string) {
      // Guarantees unicity.
      state.officesToSave.indexOf(officeId) === -1 &&
        state.officesToSave.push(officeId);
    },
    resetOfficeToSave(state: StateModel) {
      state.officesToSave = [];
    },
    addFloor(
      state: StateModel,
      { floor, officeId }: { floor: Floor; officeId: string }
    ) {
      state.offices.filter(o => o.id === officeId)[0].floors.push(floor);
    },
    deleteBooking(state, bookingId) {
      for (const key in state.bookings) {
        if (state.bookings[key].id === bookingId) {
          delete state.bookings[key];
          return;
        }
      }
    },
    setNextBooking(state, booking) {
      state.nextBooking = booking;
    },
    setSelectedOffice(state, officeId) {
      localStorage.selectedOfficeId = officeId;
      state.selectedOfficeId = officeId;
    },
    setSelectedDate(state, date) {
      state.selectedDate = date;
    },
    setUserAdmin(state) {
      state.isUserAdmin = true;
    }
  },
  actions: {
    setCurrentUser(context, user) {
      context.commit("setCurrentUser", user);
    },
    setUserAdmin(context) {
      context.commit("setUserAdmin");
    },
    async fetchBookings(context: ActionContext<StateModel, StateModel>) {
      const bookings = await getBookings(
        context.state.selectedOfficeId,
        context.state.selectedDate
      );
      context.commit("setBookings", bookings);
    },
    async fetchOffices(context: ActionContext<StateModel, StateModel>) {
      const offices = await getOffices();
      context.commit("setOffices", offices);
    },
    async saveOffices(context: ActionContext<StateModel, StateModel>) {
      await saveOffices(
        context.state.offices.filter(o =>
          context.state.officesToSave.includes(o.id)
        )
      );
      context.commit("resetOfficeToSave");
    },
    addOffice(context, office: Office) {
      context.commit("addOffice", office);
      context.commit("setOfficeToSave", office.id);
    },
    addFloor(
      context: ActionContext<StateModel, StateModel>,
      { floor, officeId }: { floor: Floor; officeId: string }
    ) {
      context.commit("addFloor", { floor, officeId });
      context.commit("setOfficeToSave", officeId);
    },
    async fetchNextBooking(context) {
      const nextBooking = await getNextBooking();
      context.commit("setNextBooking", nextBooking);
    },
    async deleteBookings(context, bookingId: string) {
      const result = await deleteBooking(bookingId);
      await context.dispatch("fetchBookings");
      await context.dispatch("fetchNextBooking");
      return result;
    },
    async confirmBooking(context, payload) {
      const result = await bookPlace(payload);
      await context.dispatch("fetchBookings");
      await context.dispatch("fetchNextBooking");
      return result;
    },
    async confirmPresence(context) {
      if (!context.state.nextBooking) {
        return null;
      }
      const res = await confirmPresence(context.state.nextBooking.id);
      if (res instanceof Error) {
        return res;
      } else {
        context.commit("confirmBooking", context.state.nextBooking.id);
      }
    }
  }
});
