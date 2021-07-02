<template>
  <div class="col edit-office">
    <div class="title">Edition des plans</div>
    <div>
      <ul>
        <li>
          Cet écran permet d'ajouter et de placer les bureaux disponibles pour
          chaque étage
        </li>
        <li>
          Attention : il n'est pas possible pour l'instant de supprimer une
          place
        </li>
        <li>
          Les modifications ne peuvent être enregistrées que par un
          administrateur
        </li>
      </ul>
    </div>
    <div>
      <div class="title">
        Nom de l'étage:
        <div v-show="!editFloorName">
          <div class="floor-name-wrapper">
            <div class="floor-name">{{ this.floor.name }}</div>
            <button
              class="edit-button icon-button clickable"
              v-show="!editFloorName"
              @click="toggleEditFloorName()"
            ></button>
          </div>
        </div>
        <div class="input-wrapper" v-show="editFloorName">
          <input
            v-model="editedFloorName"
            v-bind:placeholder="this.floor.name"
          />
          <button
            class="clickable"
            v-show="editFloorName"
            @click="toggleEditFloorName()"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <div class="row floor-detail" v-if="floor" :key="key">
      <div class="plan-container">
        <img
          id="plan"
          class="plan"
          v-bind:src="planImageUrl"
          alt="Plan non disponible"
          @click="updatePos"
          draggable="false"
          @drop="updatePos($event)"
          @dragover.prevent
          @dragenter.prevent
        />
        <div v-for="place in places" :key="'place-text-' + place.id">
          <div
            :id="'place-label-' + place.id"
            v-if="place.position"
            class="place-label"
            :class="{ selected: selectedPlace.id === place.id }"
            :key="'place-label-' + place.id"
            :style="{
              top: place.position.top + '%',
              left: place.position.left + '%'
            }"
            @click="selectedPlace = place"
            draggable="true"
            @dragstart="onDragStart(place, $event)"
          >
            {{ place.number }}
          </div>
        </div>
      </div>
      <div class="col">
        <PlaceEditor
          v-if="selectedPlace.id"
          :delete-place="placeId => deletePlace(placeId)"
          :selected-place="selectedPlace"
          :update-place-number="updatePlaceNumber"
        />
        <div class="places-list">
          <div
            v-for="place in places"
            :key="place.id + place.position"
            class="place-details"
            :class="{ selected: selectedPlace === place }"
          >
            <div class="place-details-name" @click="selectedPlace = place">
              Place {{ place.number }}
            </div>
          </div>
        </div>
        <div class="add-place-form">
          <label>
            <input
              v-model="placeName"
              placeholder="Numéro de la place"
              v-on:keyup.enter="addPlace"
            />
          </label>
          <button @click="addPlace">
            Ajouter place
          </button>
        </div>
        <div class="upload-image-plan">
          <div class="test">
            <label>Editer l'image du plan:</label>

            <input
              type="file"
              id="file-upload"
              ref="file"
              placeholder="Ajouter un fichier"
              accept=".png"
              @change="onPlanFileChange()"
            />
          </div>
        </div>
      </div>
    </div>
    <button
      @click="save"
      class="button button-primary save-button"
      v-if="floor"
    >
      Enregistrer l'étage
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  deletePlace,
  getFloorPlan,
  getOffice,
  saveFloorPlaces,
  updateFloorName,
  uploadFile
} from "@/services";
import { uuid } from "vue-uuid";
import PlaceEditor from "@/views/PlaceEditor";

export default {
  name: "EditPlaces.vue",
  components: { PlaceEditor },
  async created() {
    this.selectedOfficeId = this.$route.params.officeId;
    await this.loadOffice(this.selectedOfficeId);
    this.selectedFloorId = this.$route.params.floorId;
    await this.fetchPlaces({
      officeId: this.selectedOfficeId,
      floorId: this.selectedFloorId
    });
    this.planImage = await getFloorPlan(
      this.selectedFloorId,
      this.selectedOfficeId
    );
    this.planImageUrl = "data:image/png;base64," + this.planImage;
    this.places = this.$store.getters.floorPlaces(this.selectedFloorId);
  },
  data() {
    return {
      office: {},
      selectedFloorId: "",
      selectedFloor: {},
      key: 1,
      selectedPlace: {},
      placeName: "",
      file: "",
      planImage: "",
      planImageUrl: null,
      editFloorName: false,
      editedFloorName: "",
      places: []
    };
  },
  computed: {
    floor() {
      if (this.office && this.office.floors) {
        return this.office.floors.find(f => f.id === this.selectedFloorId);
      }
      return null;
    }
  },
  methods: {
    ...mapActions(["fetchOffices", "fetchPlaces"]),
    async loadOffice() {
      const selectedOfficeId = this.selectedOfficeId;
      if (!selectedOfficeId) {
        return null;
      }
      this.office = await getOffice(selectedOfficeId);
      this.selectedFloorId = this.office.floors[0].id;
      this.selectedPlace = {};
    },
    addPlace() {
      const newPlace = {
        number: this.placeName,
        id: uuid.v4(),
        position: { left: 50, top: 50 }
      };
      this.places.push(newPlace);
      this.key = this.key + 1;
      this.selectedPlace = newPlace;
      this.placeName = "";
    },
    async deletePlace(placeId) {
      console.log("delete PLAAAACE");
      const confirmed = confirm(
        "Voulez-vous vraiment supprimer cette place ? Les réservations futures pour cette place seront automatiquement annulées"
      );
      if (confirmed) {
        await deletePlace(placeId);
        this.places = this.places.filter(p => p.id !== placeId);
        this.$toasted.info("Place supprimée");
      }
    },
    async save() {
      if (this.file !== "") {
        await this.uploadPlan();
      }
      if (
        this.floor.name !== this.editedFloorName &&
        this.editedFloorName !== ""
      ) {
        await updateFloorName(
          this.office.id,
          this.floor.id,
          this.editedFloorName
        );
      }
      const result = await saveFloorPlaces(
        this.office.id,
        this.selectedFloorId,
        this.places
      );
      if (result instanceof Error) {
        console.error(result);
        this.$toasted.error("Erreur lors de la sauvegarde");
      } else {
        this.$toasted.success("Plan de l'étage enregistré");
      }
    },
    updatePlaceNumber(value) {
      this.selectedPlace.number = value;
    },
    updatePos(e) {
      const planRect = document.getElementById("plan").getBoundingClientRect();
      const labelRect = document
        .getElementById("place-label-" + this.selectedPlace.id)
        .getBoundingClientRect();
      const leftPercent =
        Math.round(
          ((e.x - planRect.x - labelRect.width / 2) / planRect.width) * 10000
        ) / 100;
      const topPercent =
        Math.round(
          ((e.y - planRect.y - labelRect.height / 2) / planRect.height) * 10000
        ) / 100;
      this.selectedPlace.position.left = leftPercent;
      this.selectedPlace.position.top = topPercent;
    },
    onDragStart(place) {
      this.selectedPlace = place;
    },
    async uploadPlan() {
      const formData = new FormData();
      formData.append("file", this.file);
      await uploadFile(formData, this.selectedFloorId, this.office.id);
    },
    onPlanFileChange() {
      this.file = this.$refs.file.files[0];
      this.planImageUrl = URL.createObjectURL(this.file);
    },
    toggleEditFloorName() {
      this.editFloorName = !this.editFloorName;
      this.editedFloorName = "";
    }
  }
};
</script>

<style scoped>
.edit-office {
  margin: 0 2em;
}

.office-and-floor-filters > * {
  margin: 1em 0;
}

.place-details {
  cursor: pointer;
  padding: 0.2em;
}

.place-details-name {
  padding: 0.2em;
}

.place-details button {
  min-width: 2em;
  max-width: 2em;
  min-height: 2em;
  max-height: 2em;
}

.places-list {
  max-height: 70vh;
  overflow-y: auto;
  margin-bottom: 1em;
}

.place-label {
  position: absolute;
  background-color: var(--primary);
  color: var(--text-light);
  cursor: pointer;
  padding: 1px 4px;
  height: 18px;
  line-height: 22px;
  font-size: 16px;
}

.selected {
  background-color: var(--free);
  color: var(--text-darker);
}

.floor-detail {
  justify-content: center;
}

.save-button {
  align-self: center;
  padding: 0.5rem 0.6rem;
}

.upload-image-plan {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.upload-icon {
  width: 2rem;
  height: 1.3rem;
  cursor: pointer;
}

.save-button > label {
  color: white;
  font-size: 1rem;
}

.test {
  display: flex;
  flex-direction: column;
}

.edit-button {
  background-image: url("../assets/edit.svg");
  background-repeat: no-repeat;
  border: none;
  width: 17px;
  height: 15px;
  background-color: transparent;
}

.floor-name-wrapper {
  display: flex;
  flex-direction: row;
  margin-left: 2rem;
}

.floor-name-wrapper button {
  margin: 0.8rem;
}

.floor-name {
  font-size: 2rem;
  color: black;
}

.input-wrapper {
  margin-left: 2rem;
}
</style>
