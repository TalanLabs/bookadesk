<template>
  <div class="col edit-office">
    <div class="title">Réservation de bureaux</div>
    <div class="list-offices_container view">
      <div v-for="office in offices" :key="office.id">
        <div class="section-title">Site {{ office.name }}</div>
        <div v-if="office.floors.length > 0">
          <div class="list-offices_headers row">
            <div class="cell">Etage</div>
            <div class="cell-action">Action</div>
          </div>
          <div
            v-for="floor in office.floors"
            :key="floor.id"
            class="list-offices_floors row"
          >
            <div class="cell">{{ floor.name }}</div>
            <div class="cell-action">
              <button
                class="edit-button icon-button clickable"
                v-show="!editMode"
                @click="$router.push(`/edit-places/${office.id}/${floor.id}`)"
              ></button>
            </div>
          </div>
        </div>
        <div v-if="editMode">
          Ajouter un étage
          <div class="add-floor-form">
            <label>
              <input
                v-model="floorNames[office.id]"
                :ref="`floorName${office.id}`"
                placeholder="Nom de l'étage"
                v-on:keyup.enter="
                  () => floorNames[office.id] && addFloor(office.id)
                "
                required
              />
            </label>
            <button
              @click="addFloor(office.id)"
              :disabled="!floorNames[office.id]"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
      <div class="add-office-wrapper" v-if="editMode">
        Ajouter un batiment
        <div class="add-office-form">
          <label>
            <input
              v-model="officeName"
              placeholder="Nom du batiment"
              v-on:keyup.enter="() => isOfficeNameValid && addOffice()"
              required
            />
          </label>
          <button @click="addOffice" :disabled="!isOfficeNameValid">
            Ajouter
          </button>
        </div>
      </div>
      <button
        @click="save"
        class="button button-primary save-button"
        v-if="editMode"
      >
        Enregistrer
      </button>
      <button
        @click="editMode = true"
        class="button button-primary save-button"
        v-else
      >
        Modifier
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SelectOffice from "../components/SelectOffice";
import { getOffice, saveFloorPlaces } from "@/services";
import LabelEditor from "@/components/LabelEditor";
import { toLowerSnakeCase } from "@/util";
import { uuid } from "vue-uuid";

export default {
  name: "EditOffice.vue",
  async created() {
    this.$store.commit("resetOfficeToSave");
    await this.fetchOffices();
    this.floorNames = this.offices.map(o => {
      return {
        [o.id]: ""
      };
    });
  },
  data() {
    return {
      officeName: "",
      floorNames: [],
      editMode: false,
      uuid: uuid
    };
  },
  computed: {
    ...mapGetters(["offices"]),
    isOfficeNameValid() {
      const newId = toLowerSnakeCase(this.officeName);
      return newId && !this.offices.map(o => o.id).includes(newId);
    }
  },
  methods: {
    ...mapActions(["fetchOffices"]),
    async addOffice() {
      const newOffice = {
        id: `${this.uuid.v4()}`,
        name: this.officeName,
        floors: []
      };
      this.floorNames.push({
        [this.officeName]: ""
      });
      this.officeName = "";
      await this.$store.dispatch("addOffice", newOffice);
    },
    async addFloor(officeId) {
      const newFloor = {
        id: `${this.uuid.v4()}`,
        name: this.floorNames[officeId],
        places: []
      };
      await this.$store.dispatch("addFloor", { floor: newFloor, officeId });
      this.floorNames[officeId] = "";
    },
    async save() {
      const result = await this.$store.dispatch("saveOffices");
      this.editMode = false;
      if (result instanceof Error) {
        console.error(result);
        this.$toasted.error("Erreur lors de la sauvegarde");
      } else {
        this.$toasted.success("Bâtiments et Étages enregistrés");
      }
    }
  }
};
</script>

<style scoped>
.edit-button {
  background-image: url("../assets/edit.svg");
  background-repeat: no-repeat;
  border: none;
  width: 17px;
  height: 15px;
  background-color: transparent;
}

.cell {
  flex-grow: 1.5;
  width: 50%;
  padding: 0.5em;
}

.cell-action {
  flex-grow: 1;
}

.list-offices_headers {
  margin-top: 16px;
  font-size: medium;
}

.list-offices_floors {
  cursor: pointer;
  padding: 4px;
}

.list-offices_floors:hover {
  opacity: 0.8;
}

.list-offices_floors:nth-child(odd) {
  background: var(--background-cards);
}

.add-office-wrapper {
  margin: 1em 0;
}
</style>
