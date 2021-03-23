<template>
  <button
    @click="onClickDelete"
    class="button cancel-button"
  >
    Annuler
  </button>
</template>

<script>
export default {
  name: "CancelBooking",
  props: {
    bookingId: String,
  },
  methods: {
    async onClickDelete() {
      const result = await this.$store.dispatch("deleteBookings", this.bookingId);
      if (result instanceof Error) {
        this.$toasted.error("Erreur lors de l'annulation de la réservation  ");
      } else {
        this.$toasted.success("Réservation annulée");
      }
    },
  },
};
</script>

<style scoped>
  .cancel-button {
    margin-top: 8px;
    font-size: .8em;
    border-radius: 6px;
    background-color: var(--secondary);
    color: var(--text-light);
    padding: .5em 3em;
  }
  .cancel-button:hover {
   box-shadow: none;
    background-color: var(--primary);
  }
</style>
