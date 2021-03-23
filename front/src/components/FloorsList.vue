<template>
  <div class="floors-list" v-if="office">
    <div class="floor">
      <div class="floor-selection row">
        <ShowPlanButton @clicked="showPlan = !showPlan"></ShowPlanButton>
        <!--        <div class="floor-name">Etage: {{ floor.name }}</div>-->
        <select
          v-model="selectedFloorId"
          class="select-css floor-select"
          @change="onSelectFloor"
        >
          <option
            v-for="(option, index) in office.floors"
            :value="option.id"
            :key="option.id"
            :selected="index === 0"
            >{{ option.name }}
          </option>
        </select>
      </div>
      <div class="plan-container" v-if="showPlan">
        <img
          class="plan"
          @click="showPlan = !showPlan"
          :src="'plans/' + floor.id + '.png'"
          alt="Plan non disponible"
        />
        <div v-for="place in floor.places" :key="'place-text-' + place.id">
          <div
            v-if="place.position"
            class="place-label"
            :style="{
              top: place.position.top + '%',
              left: place.position.left + '%',
              'background-color': isBooked(place.id)
                ? 'var(--booked)'
                : 'var(--free)',
              color: 'var(--text-darker)'
            }"
            @click="selectPlace(place.id)"
          >
            <v-popover offset="16">
              <!-- This will be the popover target (for the events and position) -->
              <div class="tooltip-target b3">{{ place.number }}</div>
              <!--              <button class="tooltip-target b3">Click me</button>-->

              <!-- Content of the popover -->
              <template slot="popover">
                <div
                  class="place place-popover"
                  :class="{
                    booked: isBooked(place.id),
                    selected: selectedPlaceId === place.id,
                    mine: currentUser.email === getBookedEmail(place.id)
                  }"
                  :style="{
                    width:
                      Math.max(10, getBookedEmail(place.id).length * 0.5) + 'em'
                  }"
                >
                  Place {{ place.number }}
                  <div v-if="isBooked(place.id)" class="place-status">
                    Réservée par<br />
                    {{ getBookedEmail(place.id) }}
                  </div>
                  <div v-else class="place-status">Libre</div>
                  <CancelBooking
                    v-if="
                      currentUser.email === getBookedEmail(place.id) ||
                        ($store.state.isUserAdmin && getBooking(place.id))
                    "
                    :booking-id="getBooking(place.id).id"
                  ></CancelBooking>
                  <button
                    v-if="selectedPlaceId === place.id"
                    class="button button-primary small-book-button"
                    @click="book"
                  >
                    Réserver
                  </button>
                </div>
              </template>
            </v-popover>
          </div>
        </div>
      </div>
      <div class="places" v-if="floor">
        <ul v-if="$store.state.isUserAdmin">
          <li>
            Vous êtes administrateur, vous pouvez donc annuler toutes les
            réservations.
          </li>
          <li>
            Attention : l'utilisateur n'est pas informé automatiquement : si
            vous devez annuler une réservation, veuillez le prévenir par mail.
          </li>
        </ul>
        <div
          class="place clickable"
          :class="{
            booked: isBooked(place.id),
            selected: selectedPlaceId === place.id,
            mine: currentUser.email === getBookedEmail(place.id)
          }"
          v-for="place in floor.places"
          :key="place.id"
          @click="selectPlace(place.id)"
        >
          Place {{ place.number }}
          <div v-if="isBooked(place.id)" class="place-status">
            Réservée par<br />
            {{ getBookedEmail(place.id) }}
          </div>
          <div v-else class="place-status">Libre</div>
          <CancelBooking
            v-if="
              currentUser.email === getBookedEmail(place.id) ||
                ($store.state.isUserAdmin && getBooking(place.id))
            "
            :booking-id="getBooking(place.id).id"
          ></CancelBooking>
          <button
            v-if="selectedPlaceId === place.id"
            class="button button-primary small-book-button"
            @click="book"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
    <button
      class="button button-primary book-button"
      @click="book"
      :disabled="!selectedPlaceId"
    >
      Réserver la place
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import { getOffice } from "@/services";
import CancelBooking from "@/components/CancelBooking.vue";
import {
  Booking,
  DayAlreadyBookedError,
  Floor,
  Office,
  PlaceAlreadyBookedError
} from "@/types";
import ShowPlanButton from "@/components/ShowPlanButton.vue";

interface ChangeEventTarget<T> extends EventTarget {
  value: T;
}

interface ChangeEvent<T> extends Event {
  target: ChangeEventTarget<T>;
}

export default Vue.extend({
  name: "FloorsList",
  components: { ShowPlanButton, CancelBooking },
  async created() {
    await this.loadPlaces();
    if (this.office && this.office.floors) {
      // init selected floor with first floor or with last selected floor
      this.selectedFloorId = this.office.floors[0].id;
      if (localStorage.selectedFloorId) {
        this.selectedFloorId = localStorage.selectedFloorId;
      }
    }
  },
  data() {
    return {
      office: {} as Office,
      selectedPlaceId: "",
      showPlan: true,
      selectedFloorId: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser", "selectedDate", "selectedOffice"]),
    floor(): Floor | undefined {
      if (this.office && this.office.floors) {
        return this.office.floors.find(
          (f: Floor) => f.id === this.selectedFloorId
        );
      }
      return undefined;
    }
  },
  methods: {
    async book() {
      if (this.isBooked(this.selectedPlaceId)) {
        return;
      }
      const options = {
        placeId: this.selectedPlaceId,
        officeId: this.selectedOffice,
        date: this.selectedDate
      };
      const result = await this.$store.dispatch("confirmBooking", options);
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
      this.selectedPlaceId = "";
    },
    async selectPlace(placeId: string) {
      if (this.isBooked(placeId)) {
        return;
      }
      this.selectedPlaceId = placeId;
    },
    async loadPlaces() {
      this.office = await getOffice(this.selectedOffice);
    },
    getBookedEmail(placeId: string): string {
      const booking = this.getBooking(placeId);
      if (!booking || !booking.email) {
        return "";
      }
      return booking.email;
    },
    getBooking(placeId: string): Booking | undefined {
      return this.$store.getters.booking(placeId, this.selectedDate);
    },
    isBooked(placeId: string): boolean {
      return !!this.getBooking(placeId);
    },
    onSelectFloor(e: ChangeEvent<string>): void {
      localStorage.selectedFloorId = e.target.value;
    }
  }
});
</script>

<style scoped>
.floor-name {
  font-size: 1.4em;
  font-weight: normal;
}

.places {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

@media (min-width: 800px) {
  .places {
    width: 800px;
    margin-left: calc(15em - 400px);
  }
}

.place {
  background: var(--free);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 3px;
  width: 48%;
  height: 6em;
  box-sizing: border-box;
  padding: 8px 16px;
  font-size: 1.2em;
  color: var(--text-darker);
  font-weight: 600;
}

@media (min-width: 800px) {
  .place {
    width: 24%;
  }
}

@media (min-width: 400px) {
  .place {
    font-size: 1em;
  }
}

.floors-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.floor {
  width: 100%;
}

.booked {
  background: var(--booked);
  color: var(--text-darker);
  cursor: default;
  opacity: 0.9;
  box-shadow: none;
}

.selected {
  border: 2px solid var(--primary);
}

.mine {
}

.place-status {
  font-size: 0.7em;
  text-align: center;
  font-weight: normal;
}

.book-button {
  margin: 2.5em 0;
}

.small-book-button {
  padding: 0.5em 1em;
  margin: 0;
}

.floor-selection {
  margin: 8px 0 32px 0;
}

.floor-select {
  margin-left: 1em;
}

.plan-text {
  position: absolute;
}

.place-popover {
  width: 10em;
  max-width: 100vw;
}

@media (max-width: 400px) {
  .place-popover {
    width: 100vw;
  }
}
</style>
