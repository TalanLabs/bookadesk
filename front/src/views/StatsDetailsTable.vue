<template>
  <table class="table-auto">
    <tr>
      <td class="pr-2">Places</td>
      <td>{{ places }}</td>
    </tr>
    <tr>
      <td class="pr-2">Réservations</td>
      <td>{{ bookings }}</td>
    </tr>
    <tr>
      <td class="pr-2">Moyenne réservations</td>
      <td>{{ Math.floor(bookings / span) }}</td>
    </tr>
    <tr>
      <td class="pr-2">Taux d'occupation moyen</td>
      <td>{{ ((Math.floor(bookings / span) / places) * 100).toFixed(0) }}%</td>
    </tr>
  </table>
</template>
<script lang="ts">
export default {
  name: "StatsDetailsTable",
  props: {
    span: {},
    bookings: {},
    places: {}
  }
};
</script>
<style scoped></style>
