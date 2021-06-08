/**
 * TODO find a way to substitute this at deploy
 */
export default {
  apiUrl: "/api",
  keycloakUrl:
    process.env.VUE_APP_KEYCLOAK_URL || "https://keycloak.ruche-labs.net/auth"
};
