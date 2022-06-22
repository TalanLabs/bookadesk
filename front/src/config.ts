/**
 * TODO find a way to substitute this at deploy
 */
export default {
  apiUrl: process.env.VUE_APP_API_URL || "/api",
  hidePlans: process.env.VUE_APP_HIDE_PLANS || false
};
