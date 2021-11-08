/**
 * TODO find a way to substitute this at deploy
 */
export default {
  apiUrl: process.env.VUE_APP_API_URL || "/api",
  keycloakUrl:
    process.env.VUE_APP_KEYCLOAK_URL || "https://keycloak.ruche-labs.net/auth",
  keycloakRealm: process.env.VUE_APP_KEYCLOAK_REALM || "Talan"
};
