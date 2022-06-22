import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../components/Home.vue";
import BookingConfirmation from "@/views/BookingConfirmation.vue";
import BookingForm from "@/views/BookingForm.vue";
import EditOffice from "@/views/EditOffice.vue";
import EditPlaces from "@/views/EditPlaces.vue";
import Stats from "@/views/Stats.vue";
import MissingSupplies from "@/views/MissingSupplies.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/booking",
    name: "Booking",
    component: BookingForm
  },
  {
    path: "/stats",
    name: "Stats",
    component: Stats
  },
  {
    path: "/edit",
    name: "EditOffice",
    component: EditOffice
  },
  {
    path: "/edit-places/:officeId/:floorId",
    name: "EditPlaces",
    component: EditPlaces
  },
  {
    path: "/supplies",
    name: "MissingSupplies",
    component: MissingSupplies
  },
  {
    path: "/booking-confirmation",
    name: "BookingConfirmation",
    component: BookingConfirmation,
    props: true
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
  // mode: "history",
});

export default router;
