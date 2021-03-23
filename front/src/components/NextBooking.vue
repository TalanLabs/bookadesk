<template>
  <div class="next-booking">
    <div class="next-booking-title" v-if="nextBooking && nextBooking.date">
      Votre prochaine réservation est prévue pour le
      {{ getFormattedDate(nextBooking.date) }}.
    </div>
    <div v-else class="next-booking-title">
      Vous n'avez pas de réservation prévue
    </div>
  </div>
</template>

<script>
import { getReadableDate } from "@/dates";

export default {
  name: "NextBooking",
  components: {},
  computed: {
    nextBooking() {
      return this.$store.getters.nextBooking;
    }
  },
  methods: {
    getFormattedDate(date) {
      return getReadableDate(date);
    }
  }
};
</script>

<style scoped="true">
.next-booking {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background-color: var(--background-one);
}

.next-booking-title {
  font-size: 1.8rem;
  display: flex;
  justify-content: flex-start;
}
</style>
