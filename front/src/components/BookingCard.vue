<template>
  <div class="card" v-if="booking && booking.date">
    <div class="booking-title">
      {{ booking.officeName }}
    </div>
    <div class="">
      {{ getFormattedDate(booking.date) }}
    </div>
    <div>
      <div class="">{{ booking.floorName }}</div>
      <div class="">Place {{ booking.placeName }}</div>
    </div>
    <CancelBooking :booking-id="booking.id"></CancelBooking>
  </div>
</template>

<script>
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import CancelBooking from "@/components/CancelBooking";

export default {
  name: "BookingCard",
  components: { CancelBooking },
  computed: {
    booking() {
      return this.$store.getters.nextBooking;
    }
  },
  methods: {
    getFormattedDate(date) {
      const parsed = parse(date, "yyyyMMdd", Date.now());
      return format(parsed, "dd/MM/yyyy", {
        locale: fr
      });
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

.booking-title {
  margin-bottom: 8px;
  font-size: 1.2rem;
  display: flex;
  justify-content: flex-start;
}
</style>
