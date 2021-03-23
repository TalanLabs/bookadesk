<template>
  <div class="home">
    <div class="title">Bonjour {{ currentUser.given_name }},</div>
    <NextBooking class="next-booking-info"></NextBooking>
    <div
      class="confirm-button confirmed button margin-h-1"
      v-if="nextBooking && nextBooking.confirmed"
    >
      Merci d'avoir confirmé ✓
    </div>
    <div
      v-if="nextBooking && !nextBooking.confirmed && !isConfirmationDisabled()"
      class="confirm-button button button-primary margin-h-1"
      @click="confirmPresence"
    >
      Confirmer votre présence
    </div>
    <WideButton
      @click="goToBooking"
      :title="'Réserver une place'"
      subtitle="Vous pouvez faire une nouvelle réservation ici"
    >
      <div class="button-icon">
        +
      </div>
    </WideButton>
    <div class="subtitle">Mes prochaines réservations</div>
    <div class="bookings">
      <BookingCard></BookingCard>
    </div>
    <Info></Info>
    <WideButton
            @click="goToMissingSupplies"
            :title="'Signaler du matériel manquant'"
            subtitle="Gel hydroalcoolique, ..."
    >
      <div class="button-icon">
        +
      </div>
    </WideButton>
  </div>
</template>

<script>
import NextBooking from "@/components/NextBooking";
import BookingCard from "@/components/BookingCard";
import { format } from "date-fns";
import { mapGetters } from "vuex";
import WideButton from "@/views/WideButton";
import Info from "@/components/Info";

export default {
  name: "Home",
  components: {
    Info,
    WideButton,
    BookingCard,
    NextBooking,
  },
  async created() {
    await this.$store.dispatch("fetchNextBooking");
  },
  computed: {
    ...mapGetters(["currentUser"]),
    nextBooking() {
      return this.$store.getters.nextBooking;
    },
  },
  methods: {
    async goToBooking() {
      await this.$router.push({ name: "Booking" });
    },
    async goToMissingSupplies() {
      await this.$router.push({ name: "MissingSupplies" });
    },
    async confirmPresence() {
      if (this.isConfirmationDisabled()) {
        return;
      }
      const res = await this.$store.dispatch("confirmPresence");
      if (res instanceof Error) {
        this.$toasted.error("Erreur lors de la confirmation");
      } else {
        this.$toasted.success("Présence confirmée");
      }
    },
    isConfirmationDisabled() {
      const todayString = format(Date.now(), "yyyyMMdd");
      return !this.nextBooking || this.nextBooking.date !== todayString;
    },
  },
};
</script>

<style scoped="true">
.home {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30rem;
  max-width: 85%;
}

.next-booking-info {
  margin-bottom: 1em;
}

.bookings {
  margin-top: 2em;
}

.confirm-button {
  align-self: center;
  width: 60%;
  margin-top: 0;
  margin-bottom: 2em;
}

.confirmed {
  background-color: var(--primary-light);
  cursor: default;
  box-shadow: none;
  color: var(--text-light);
  font-weight: 600;
}

.button-icon {
  font-size: 2rem;
  background-color: var(--background-buttons);
  color: var(--text-light);
  min-width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
}
</style>
