<template>
  <div class="booking-confirmation">
    <div>
      Vous allez réserver la place {{ this.place.number }} pour le
      {{ getReadableDate }}
    </div>
    <button @click="book()">Valider</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { bookPlace } from "@/services";
import { DayAlreadyBookedError, PlaceAlreadyBookedError } from "@/types";
import { getReadableDate as formatDate } from "@/dates";

export default Vue.extend({
  name: "BookingForm",
  props: {
    date: { type: String },
    place: {
      type: Object,
    },
    officeId: String,
  },
  computed: {
    getReadableDate() {
      const string = formatDate(this.date);
      return string;
    },
  },
  methods: {
    async book() {
      const options = {
        placeId: this.place.id,
        officeId: this.officeId,
        date: this.date,
      };
      const result = await bookPlace(options);
      if (!result) {
        this.$toasted.success("Réservation effectuée");
      } else if (result instanceof PlaceAlreadyBookedError) {
        this.$toasted.error(
          "Désolé, cette place est déjà réservée. Veuillez réessayer avec une autre place"
        );
      } else if (result instanceof DayAlreadyBookedError) {
        this.$toasted.error("Vous avez déjà réservé une place pour ce jour");
      } else {
        this.$toasted.error("Erreur inattendue, veuillez réessayer");
      }
      await this.$router.push({ name: "Home" });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
