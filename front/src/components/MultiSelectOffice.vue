<template>
  <div class="flex flex-wrap auto-rows-min">
    <div
      v-for="option in getOfficeOptions"
      :key="option.id"
      @click="toggleOption(option.id)"
      :class="{
        'text-white bg-blue-700 ': selectedOffices.includes(option.id)
      }"
      class="bg-gray-200 mx-1.5 my-1 px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-100 hover:text-gray-700"
    >
      {{ option.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MultiSelectOffice",
  async created() {
    await this.$store.dispatch("fetchOffices");
  },
  data() {
    return {
      selectedOffices: []
    };
  },
  methods: {
    toggleOption(officeId) {
      if (this.selectedOffices.includes(officeId)) {
        this.selectedOffices = this.selectedOffices.filter(o => o !== officeId);
      } else {
        this.selectedOffices.push(officeId);
      }
      this.$emit("select-office", this.selectedOffices);
    }
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
    }
  }
};
</script>

<style scoped></style>
