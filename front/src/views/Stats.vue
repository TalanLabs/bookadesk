<template>
  <div class="stats col">
    <h1>Statistiques</h1>
    <SelectOffice @selectedOffice="loadStats"></SelectOffice>
    <datepicker
            class="stats__datepicker"
      @selected="setSelectedDate"
      :value="selectedDate"
      :monday-first="true"
      :language="fr"
    ></datepicker>
    <div v-if="stats" class="stats__day">
      <div class="stats__row">
        <div>Réservations</div>
        <div>{{ stats.bookings }}</div>
      </div>
      <div class="stats__row">
        <div>Réservations confirmées</div>
        <div>{{ stats.confirmedBookings }}</div>
      </div>
      <div class="stats__row">
        <div>Taux d'occupation</div>
        <div>{{ ((stats.bookings / stats.places) * 100).toFixed(0) }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getStats } from "@/services";
import SelectOffice from "@/components/SelectOffice.vue";
import { format } from "date-fns";
import Vue from "vue";
import { DayStats } from "@/types";
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";

export default Vue.extend({
  name: "Stats",
  components: { SelectOffice, Datepicker },
  data() {
    return {
      stats: {} as DayStats,
      fr: fr,
      selectedDate: new Date(),
    };
  },
  async created() {
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      const dateString = format(this.selectedDate, "yyyyMMdd");
      this.stats = await getStats(
        this.$store.getters.selectedOffice,
        dateString
      );
    },
    async setSelectedDate(value: Date) {
      this.selectedDate = value;
      await this.loadStats();
    },
  },
});
</script>

<style scoped>
.stats {
  max-width: 35em;
}

.stats__day {
  margin-top: 16px;
}

.stats__row {
  display: flex;
  padding: 8px 16px;
}

.stats__row:nth-child(odd) {
  background: var(--background-cards);
}

.stats__row > * {
  width: 50%;
}

.stats__datepicker {
  align-self: center;
  margin: 32px;
}
</style>
