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
    ></Datepicker>
  </div>
</template>
<script lang="ts">
import Datepicker from "vuejs-datepicker";
import { add } from "date-fns";
import { fr } from "vuejs-datepicker/dist/locale";

export default {
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
  methods: {
    onSelect(d: Date) {
      this.$emit("change", d);
    }
  }
};
</script>
<style>
.calendar-class .disabled {
  background-color: transparent;
}
</style>
