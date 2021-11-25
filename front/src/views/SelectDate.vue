<template>
  <div>
    <Datepicker
      v-model="selectedDate"
      maximum-view="day"
      :inline="true"
      :disabled-dates="disabledDates"
      :language="fr"
      :monday-first="true"
      :full-month-name="true"
      @selected="onSelect"
      :calendar-class="'calendar-class'"
      :highlighted="{
        dates: bookedDates,
        includeDisabled: true
      }"
    ></Datepicker>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Datepicker from "vuejs-datepicker";
import { add } from "date-fns";
import { fr } from "vuejs-datepicker/dist/locale";
import { getDateFromString } from "@/dates";
import { Booking } from "@/types";

export default Vue.extend({
  name: "SelectDate",
  components: { Datepicker },
  data() {
    return {
      selectedDate: new Date(),
      disabledDates: {
        to: add(new Date(), { days: -1 }),
        from: add(new Date(), { months: 1 })
      },
      fr: fr
    };
  },
  async created() {
    await this.$store.dispatch("fetchNextBookings");
  },
  methods: {
    onSelect(d: Date) {
      this.$emit("change", d);
    }
  },
  computed: {
    bookedDates() {
      const next = this.$store.getters.nextBookings || [];
      return next.map((b: Booking) => getDateFromString(b.date));
    }
  }
});
</script>
<style>
.calendar-class .disabled {
  background-color: transparent;
}
</style>
