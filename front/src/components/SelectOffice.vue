<template>
  <div>
    <label>
      <select
        class="select-css"
        @change="onChangeSelectedOffice"
        :value="selectedOfficeId"
      >
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
import {mapGetters, mapActions} from "vuex";

export default {
  name: "SelectOffice",
  async created() {
    await this.fetchOffices();
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["offices"]),
    selectedOfficeId() {
      return this.$store.getters.selectedOffice;
    },
    getOfficeOptions() {
      return this.offices.map(o => {
        return {
          name: o.name,
          id: o.id
        }
      })
    }
  },
  methods: {
    ...mapActions(["fetchOffices"]),
    onChangeSelectedOffice(e) {
      this.$store.commit("setSelectedOffice", e.target.value);
      localStorage.selectedFloorId = "";
      this.$emit("selectedOffice", e.target.value);
    },
  },
};
</script>

<style scoped></style>
