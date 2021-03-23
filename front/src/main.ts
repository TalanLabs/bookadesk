import axios from "axios";
import Keycloak from "keycloak-js";
import Toasted from "vue-toasted";
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import config from "./config";
import store from "./store";
import VTooltip from "v-tooltip";

Vue.use(VTooltip);

Vue.config.productionTip = false;
Vue.use(Toasted, {
  duration: 3000,
  keepOnHover: true,
  className: "toast"
});

// Load saved state
if (localStorage.selectedOfficeId) {
  store.commit("setSelectedOffice", localStorage.selectedOfficeId);
}

const kcConfig: Keycloak.KeycloakConfig = {
  url: `${config.keycloakUrl}`,
  realm: "Talan",
  clientId: "desk-booking-front"
};

const keycloak = Keycloak(kcConfig);
keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then(async function(authenticated) {
    if (
      keycloak.tokenParsed &&
      keycloak.tokenParsed.resource_access &&
      keycloak.tokenParsed.resource_access["desk-booking-front"]
    ) {
      if (
        keycloak.tokenParsed.resource_access[
          "desk-booking-front"
        ].roles.includes("admin")
      ) {
        await store.dispatch("setUserAdmin");
      }
    }

    axios.defaults.headers.common.Authorization = "Bearer " + keycloak.token;
    console.debug("Keycloak initialized");
    keycloak.loadUserInfo().then(async userInfo => {
      console.debug("User loaded", userInfo);
      await store.dispatch("setCurrentUser", userInfo);
    });
    new Vue({
      router,
      store: store,
      render: h => h(App)
    }).$mount("#app");

    // Set interval to refresh token
    setInterval(() => {
      console.log("Refreshing token...");
      keycloak
        .updateToken(70)
        .then(refreshed => {
          axios.defaults.headers.common.Authorization =
            "Bearer " + keycloak.token;
          if (refreshed) {
            console.debug("Token refreshed", keycloak.token);
          }
        })
        .catch(() => {
          console.error("Failed to refresh token");
        });
    }, 70000);
  });

axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 403) {
      if (error.response.data === "Access denied") {
        console.log("Acces denied, reset auth");
        keycloak.updateToken(30);
        // location.reload();
      }
    }
    return Promise.reject(error);
  }
);
