<template>
  <div>
    <label>
      <select class="select-css" v-model="selectedOffice">
        <option
          v-for="option in getOfficeOptions"
          v-bind:value="option.id"
          :key="option.id"
          >{{ option.name }}</option
        >
      </select>
    </label>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SelectOffice",
  async created() {
    await this.$store.dispatch("fetchOffices");
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["offices"]),
    getOfficeOptions() {
      return this.offices.map(o => {
        return {
          name: o.name,
          id: o.id
        };
      });
    },
    selectedOffice: {
      get() {
        return this.$store.getters.selectedOffice;
      },
      set(value) {
        this.$store.dispatch("setSelectedOffice", value);
        localStorage.selectedFloorId = "";
        this.$emit("selectedOffice", value);
      }
    }
  }
};
</script>

<style scoped></style>
