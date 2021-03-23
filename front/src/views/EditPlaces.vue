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
        <div v-for="place in floor.places" :key="'place-text-' + place.id">
          <div
            :id="'place-label-' + place.id"
            v-if="place.position"
            class="place-label"
            :class="{ selected: selectedPlace.id === place.id }"
            :key="'place-label-' + place.id"
            :style="{
              top: place.position.top + '%',
              left: place.position.left + '%',
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
        <div
          class="place-config col"
          v-if="selectedPlace.id"
          :key="selectedPlace.id"
        >
          <div class="place-config__name row">
            Place
            <LabelEditor
              :text="this.selectedPlace.number"
              :key="this.selectedPlace.id"
              @edited="updatePlaceNumber"
            ></LabelEditor>
          </div>
          <div class="place-position" v-if="selectedPlace.position">
            <div class="place-position-x row">
              <button @click="selectedPlace.position.left -= 0.2">
                &lt;
              </button>
              <div class="place-position-y col">
                <button @click="selectedPlace.position.top -= 0.2">
                  ^
                </button>
                <button @click="selectedPlace.position.top += 0.2">
                  v
                </button>
              </div>
              <button @click="selectedPlace.position.left += 0.2">
                &gt;
              </button>
            </div>
          </div>
        </div>
        <div class="places-list">
          <div
            v-for="place in floor.places"
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

          <!-- <button
            @click="upload()"
            class="button button-primary save-button"
            v-if="floor"
          >
            <label>Upload</label>
            <img class="upload-icon" src="../assets/upload.svg" />
          </button> -->
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
  getOffice,
  saveFloorPlaces,
  uploadFile,
  getFloorPlan,
} from "@/services";
import LabelEditor from "@/components/LabelEditor";

export default {
  name: "EditPlaces.vue",
  components: { LabelEditor },
  async created() {
    this.selectedOfficeId = this.$route.params.officeId;
    await this.loadOffice(this.selectedOfficeId);
    this.selectedFloorId = this.$route.params.floorId;
    this.planImage = await getFloorPlan(
      this.selectedFloorId,
      this.selectedOfficeId
    );
    this.planImageUrl = "data:image/png;base64," + this.planImage;
  },
  data() {
    return {
      office: {},
      selectedFloorId: "",
      key: 1,
      selectedPlace: {},
      placeName: "",
      file: "",
      planImage: "",
      planImageUrl: null,
    };
  },
  computed: {
    floor() {
      if (this.office && this.office.floors) {
        return this.office.floors.find((f) => f.id === this.selectedFloorId);
      }
      return null;
    },
  },
  methods: {
    ...mapActions(["fetchOffices"]),
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
        id: this.floor.id + "_" + this.placeName,
        position: { left: 50, top: 50 },
      };
      this.floor.places.push(newPlace);
      this.key = this.key + 1;
      this.selectedPlace = newPlace;
      this.placeName = "";
    },
    async save() {
      if (this.file != "") {
        await this.uploadPlan();
      }
      const result = await saveFloorPlaces(this.office.id, this.floor);
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
      const result = await uploadFile(
        formData,
        this.selectedFloorId,
        this.office.id
      );
    },
    onPlanFileChange() {
      this.file = this.$refs.file.files[0];
      this.planImageUrl = URL.createObjectURL(this.file);
    },
  },
};
</script>

<style scoped>
.edit-office {
  margin: 0 2em;
}

.office-and-floor-filters {
  max-width: 30em;
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

.place-config {
  margin: 0 0 1em 0;
  padding: 1em;
  border-radius: 1em;
  background-color: var(--background-cards);
}

.place-config__name {
  margin-bottom: 0.5em;
}

.place-position {
  align-self: center;
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

.plan-file-upload {
  display: inline-block;
  padding: 2px;
  background-color: yellow;
  border: 1px solid #ccc;
  cursor: pointer;
}

.selected {
  background-color: var(--free);
  color: var(--text-darker);
}

.floor-detail {
  justify-content: center;
}

.place-position-y {
  align-items: center;
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
</style>
