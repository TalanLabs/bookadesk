<template>
  <div class="footer col">
    <div class="version">bookAdesk version {{ version }}</div>
  </div>
</template>

<script>
import { getVersion } from "@/services";

export default {
  name: "Footer",
  async created() {
    this.version = await getVersion();
  },
  data() {
    return {
      version: "???"
    };
  }
};
</script>

<style scoped>
.footer {
  margin-top: 20px;
  background-color: #2c3e50;
  color: aliceblue;
  height: 80px;
  align-items: center;
  justify-content: center;
}

.version {
  padding: 16px;
}
</style>
