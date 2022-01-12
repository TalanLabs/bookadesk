<template>
  <div>
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
import StatsDetailsTable from "@/views/StatsDetailsTable.vue";
import { BookingStats } from "@/types";

export default {
  name: "StatsDisplay",
  components: { StatsDetailsTable },
  props: {
    span: {} as number,
    stats: {} as BookingStats
  }
};
</script>
<style scoped>
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
</style>
