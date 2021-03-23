<template>
  <div class="booking-form">
    <div class="title">
      Réserver<br />
      une place de bureau
    </div>
    <SelectOffice class="office-selection"></SelectOffice>
    <div class="subtitle">
      Sélectionner une date
    </div>
    <div class="filters">
      <select
        v-model="selectedDay"
        @change="setSelectedDate"
        class="select-css"
      >
        <option
          v-for="option in dateOptions"
          v-bind:value="option.value"
          :key="option.value"
          >{{ option.text }}</option
        >
      </select>
    </div>
    <div class="subtitle">
      Sélectionner une place
    </div>
    <FloorsList :key="selectedOffice + selectedDate"></FloorsList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { add, format } from "date-fns";
import { fr } from "date-fns/locale";
import { mapGetters } from "vuex";

import { Office } from "@/types";
import SelectOffice from "@/components/SelectOffice.vue";
import FloorsList from "@/components/FloorsList.vue";

export default Vue.extend({
  name: "BookingForm",
  components: { FloorsList, SelectOffice },
  data() {
    return {
      office: {} as Office,
      selectedDay: 0,
    };
  },
  async created() {
    this.setSelectedDate();
  },
  computed: {
    ...mapGetters(["currentUser", "selectedDate", "selectedOffice"]),
    dateOptions() {
      function getLabelForDate(daysOffset: number) {
        return format(add(new Date(), { days: daysOffset }), "cccc d MMM", {
          locale: fr,
        });
      }

      function getOption(offsetInDays: number) {
        return {
          text: getLabelForDate(offsetInDays),
          value: offsetInDays,
        };
      }
      const options = [
        { text: "Aujourd'hui", value: 0 },
        { text: "Demain", value: 1 },
        getOption(2),
        getOption(3),
        getOption(4),
        getOption(5),
        getOption(6),
        getOption(7),
      ];
      return options.filter((o) => {
        const day = add(new Date(), { days: o.value }).getDay();
        return day !== 0 && day !== 6;
      });
    },
  },
  methods: {
    getSelectedDate() {
      const date = add(new Date(), { days: this.selectedDay });
      return format(date, "yyyyMMdd");
    },
    setSelectedDate() {
      this.$store.commit("setSelectedDate", this.getSelectedDate());
      this.$store.dispatch("fetchBookings");
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.booking-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 30em;
  max-width: 85%;
}

.office-selection {
  margin-top: 32px;
}

.filters {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 8px 0 0 0;
}
</style>
