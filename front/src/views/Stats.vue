<template>
  <div class="stats col">
    <h1 class="text-4xl mb-2 ">
      Statistiques
    </h1>
    <div
      class="border-2 border-dashed border-blue-600 rounded-xl p-4 flex-column"
    >
      <MultiSelectOffice
        v-on:select-office="onSelectOffices"
      ></MultiSelectOffice>
      <div class="flex items-center">
        <label class="text-lg">Date de début : </label>
        <div class="">
          <datepicker
            class="px-4 "
            @selected="setSelectedDate"
            :value="selectedDate"
            :monday-first="true"
            :language="fr"
          ></datepicker>
        </div>
      </div>
      <div class="flex items-center">
        <label class="text-lg">Date de fin : </label>
        <div class="">
          <datepicker
            class="px-4 "
            @selected="setSelectedEndDate"
            :value="selectedEndDate"
            :monday-first="true"
            :language="fr"
          ></datepicker>
        </div>
      </div>
      <button
        @click="loadStats"
        class="text-white rounded-full bg-indigo-800  px-4 py-2 hover:bg-indigo-400 justify-self-center items-center mt-4"
      >
        Afficher les statistiques
      </button>
    </div>
    <h3 class="text-2xl mt-4">Total</h3>
    <div v-if="stats" class="stats__day">
      <div class="stats__row">
        <div>Jours</div>
        <div>{{ span }}</div>
      </div>
      <div class="stats__row">
        <div>Places</div>
        <div>{{ stats.totalPlaces }}</div>
      </div>
      <div class="stats__row">
        <div>Réservations</div>
        <div>{{ stats.totalBookings }}</div>
      </div>
      <div class="stats__row">
        <div>Moyenne réservations</div>
        <div>{{ Math.floor(stats.totalBookings / span) }}</div>
      </div>
      <div class="stats__row">
        <div>Taux d'occupation moyen</div>
        <div>
          {{
            (
              (Math.floor(stats.totalBookings / span) / stats.totalPlaces) *
              100
            ).toFixed(0)
          }}%
        </div>
      </div>
    </div>
    <div class="mt-6 mb-2">
      <div v-for="office in stats.offices" :key="office.officeId" class="mt-3">
        <div class="text-lg text-blue-800">{{ office.officeName }}</div>
        <StatsDetailsTable
          :places="office.placesNumber"
          :span="span"
          :bookings="office.bookingsNumber"
        />
        <div
          v-for="floor in office.floors"
          :key="floor.floorId"
          class="mt-2 ml-6"
        >
          <div class="text-purple-800">{{ floor.floorName }}</div>
          <StatsDetailsTable
            :places="floor.placesNumber"
            :span="span"
            :bookings="floor.bookingsNumber"
          />
        </div>
      </div>
    </div>
    <div>
      <h3 class="text-2xl mt-4">Réservations</h3>
      <table class="table-auto">
        <tr v-for="user in stats.users" :key="user.email">
          <td class="pr-2">{{ user.email }}</td>
          <td>{{ user.bookingsNumber }}</td>
        </tr>
      </table>
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
import StatsDetailsTable from "@/views/StatsDetailsTable.vue";
import differenceInBusinessDays from "date-fns/differenceInBusinessDays";

export default Vue.extend({
  name: "Stats",
  components: { StatsDetailsTable, MultiSelectOffice, Datepicker },
  data() {
    return {
      stats: {} as BookingStats,
      fr: fr,
      selectedDate: new Date(),
      selectedEndDate: new Date(),
      selectedOffices: []
    };
  },
  async created() {
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      const startDateString = format(this.selectedDate, "yyyyMMdd");
      const endDateString = format(this.selectedEndDate, "yyyyMMdd");
      this.stats = await getStats(
        this.selectedOffices,
        startDateString,
        endDateString
      );
    },
    async setSelectedEndDate(value: Date) {
      this.selectedEndDate = value;
    },
    async setSelectedDate(value: Date) {
      this.selectedDate = value;
    },
    onSelectOffices(offices) {
      console.log("changed", offices);
      this.selectedOffices = offices;
    }
  },
  computed: {
    span() {
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

.stats__day {
  margin-top: 16px;
  padding-left: 0;
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
  cursor: pointer !important;
}
</style>
