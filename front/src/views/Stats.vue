<template>
  <div class="stats col">
    <h1 class="text-4xl mb-2 ">
      Statistiques
    </h1>
    <div
      class="border-2 border-dashed border-indigo-600 rounded-xl p-4 flex-column"
    >
      <MultiSelectOffice
        v-on:select-office="onSelectOffices"
      ></MultiSelectOffice>
      <div class="flex items-center mt-4">
        <label class="text-lg">Date de début : </label>
        <datepicker
          class="px-4 "
          @selected="setSelectedDate"
          :value="selectedDate"
          :monday-first="true"
          :language="fr"
        ></datepicker>
      </div>
      <div class="flex items-center">
        <label class="text-lg">Date de fin : </label>
        <datepicker
          class="px-4 "
          @selected="setSelectedEndDate"
          :value="selectedEndDate"
          :monday-first="true"
          :language="fr"
        ></datepicker>
      </div>
      <button
        @click="loadStats"
        class="text-white rounded-full bg-indigo-800  px-4 py-2 hover:bg-indigo-400 justify-self-center items-center mt-4"
      >
        Afficher les statistiques
      </button>
    </div>
    <!--    results   -->
    <div v-if="stats && Object.keys(stats).length > 0">
      <StatsDisplay :span="span" :stats="stats" />
    </div>
  </div>
</template>

<script lang="ts">
import { getStats } from "@/services";
import { format } from "date-fns";
import Vue from "vue";
import { BookingStats } from "@/types";
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";
import MultiSelectOffice from "@/components/MultiSelectOffice.vue";
import differenceInBusinessDays from "date-fns/differenceInBusinessDays";
import StatsDisplay from "@/views/StatsDisplay.vue";

export default Vue.extend({
  name: "Stats",
  components: {
    StatsDisplay,
    MultiSelectOffice,
    Datepicker
  },
  data() {
    return {
      stats: {} as BookingStats,
      fr: fr,
      selectedDate: new Date() as Date,
      selectedEndDate: new Date() as Date,
      selectedOffices: [] as string[]
    };
  },
  methods: {
    async loadStats(): Promise<void> {
      const startDateString = format(this.selectedDate, "yyyyMMdd");
      const endDateString = format(this.selectedEndDate, "yyyyMMdd");
      this.stats = await getStats(
        this.selectedOffices,
        startDateString,
        endDateString
      );
    },
    setSelectedEndDate(value: Date): void {
      this.selectedEndDate = value;
    },
    setSelectedDate(value: Date): void {
      this.selectedDate = value;
    },
    onSelectOffices(offices: string[]): void {
      this.selectedOffices = offices;
    }
  },
  computed: {
    span(): number {
      return (
        differenceInBusinessDays(this.selectedEndDate, this.selectedDate) + 1
      );
    }
  }
});
</script>

<style scoped>
.stats {
  max-width: 35em;
}

.stats__row > * {
  width: 50%;
}

.stats__datepicker {
  align-self: center;
  margin: 32px;
  cursor: pointer !important;
}
</style>
