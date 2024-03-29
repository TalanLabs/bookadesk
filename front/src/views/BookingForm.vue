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
    <SelectDate @change="setSelectedDate" />
    <div class="subtitle">
      Sélectionner une place
    </div>
    <FloorsList :key="selectedOffice"></FloorsList>
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
import SelectDate from "@/views/SelectDate.vue";

export default Vue.extend({
  name: "BookingForm",
  components: { SelectDate, FloorsList, SelectOffice },
  data() {
    return {
      office: {} as Office
    };
  },
  async created() {
    this.setSelectedDate(new Date());
  },
  computed: {
    ...mapGetters(["currentUser", "selectedDate", "selectedOffice"]),
    dateOptions() {
      function getLabelForDate(daysOffset: number) {
        return format(add(new Date(), { days: daysOffset }), "cccc d MMM", {
          locale: fr
        });
      }

      function getOption(offsetInDays: number) {
        return {
          text: getLabelForDate(offsetInDays),
          value: offsetInDays
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
        getOption(7)
      ];
      return options.filter(o => {
        const day = add(new Date(), { days: o.value }).getDay();
        return day !== 0 && day !== 6;
      });
    }
  },
  methods: {
    setSelectedDate(newDate: Date) {
      const dateString = format(newDate, "yyyyMMdd");
      this.$store.commit("setSelectedDate", dateString);
      this.$store.dispatch("fetchBookings");
    }
  }
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
