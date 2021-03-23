<template>
  <div id="app">
    <div id="nav">
      <div class="app-title" v-if="$route.name === 'Home'">bookAdesk</div>
      <div class="back-arrow" @click="goHome" v-if="$route.name !== 'Home'">
        Accueil
      </div>
      <div class="row">
        <div
          class="nav-link"
          @click="$route.name !== 'Stats' && $router.push({ name: 'Stats' })"
        >
          Stats
        </div>
        <div
          class="nav-link"
          v-if="$store.state.isUserAdmin"
          @click="
            $route.name !== 'EditOffice' && $router.push({ name: 'EditOffice' })
          "
        >
          Edition
        </div>
      </div>
    </div>
    <router-view class="view" />
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from "@/components/Footer";
export default {
  components: { Footer },
  methods: {
    goHome() {
      this.$router.push({ name: "Home" });
    },
    goInfo() {
      this.$router.push({ name: "Info" });
    }
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
  display: flex;
  justify-content: space-between;
}

.view {
  margin: auto;
  min-height: calc(100vh - 218px);
}
.back-arrow {
  cursor: pointer;
}

.info-button {
  background-color: var(--background-green);
  color: var(--text-light);
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.4em;
  cursor: pointer;
}

.app-title {
  color: var(--primary);
  font-weight: 700;
  font-size: 3em;
  font-variant: small-caps;
}

.nav-link {
  padding: 0.5em;
  margin: 0 8px;
  cursor: pointer;
}
</style>
