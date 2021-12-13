<template>
  <div>
    <label>
      <select
        class="select-css"
        @change="onChangeSelectedOffice"
        :value="selectedOffice"
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
    ...mapGetters(["offices", "selectedOffice"]),
    getOfficeOptions() {
      return this.offices.map(o => {
        return {
          name: o.name,
          id: o.id
        };
      });
    }
  },
  methods: {
    onChangeSelectedOffice(e) {
      this.$store.dispatch("setSelectedOffice", e.target.value);
      localStorage.selectedFloorId = "";
      this.$emit("selectedOffice", e.target.value);
    }
  }
};
</script>

<style scoped></style>
