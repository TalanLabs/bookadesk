<template>
  <div class="place-config col" v-if="selectedPlace.id" :key="selectedPlace.id">
    <div class="row place-editor-title">
      <h3>Place sélectionnée</h3>
      <button
        id="delete-place"
        class="place-editor__delete-button icon-button"
        @click="deletePlace(selectedPlace.id)"
      >
        <!--        Supprimer-->
      </button>
    </div>
    <div class="place-config__name row">
      <span>Nom :</span>
      <LabelEditor
        :text="this.selectedPlace.number"
        :key="this.selectedPlace.id"
        @edited="updatePlaceNumber"
      ></LabelEditor>
    </div>
    <div class="place-position" v-if="selectedPlace.position">
      <div class="place-position-x row">
        <button
          @click="selectedPlace.position.left -= 0.2"
          class="arrow-left"
        ></button>
        <div class="place-position-y col">
          <button
            class="arrow-top"
            @click="selectedPlace.position.top -= 0.2"
          ></button>
          <button
            @click="selectedPlace.position.top += 0.2"
            class="arrow-bottom"
          ></button>
        </div>
        <button @click="selectedPlace.position.left += 0.2"></button>
      </div>
    </div>
  </div>
</template>
<script>
import LabelEditor from "@/components/LabelEditor";

export default {
  name: "PlaceEditor",
  components: { LabelEditor },
  props: {
    deletePlace: {},
    selectedPlace: {},
    updatePlaceNumber: {}
  }
};
</script>
<style scoped>
.office-and-floor-filters > * {
  margin: 1em 0;
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

.place-position-y {
  align-items: center;
}

.save-button > label {
  color: white;
  font-size: 1rem;
}

.floor-name-wrapper button {
  margin: 0.8rem;
}

.place-editor__delete-button {
  background-image: url("../assets/bin.png?inline");
}

.place-position button {
  background-image: url("../assets/arrow.svg?inline");
  margin: 8px;
  width: 1.8em;
  height: 1.8em;
  padding: 8px;
  border: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 90%;
  flex-shrink: unset;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 5px;
}

.place-position button:hover {
  background-color: var(--primary-light);
}

.arrow-top {
  transform: rotate(-90deg);
}

.arrow-left {
  transform: rotate(180deg);
}

.arrow-bottom {
  transform: rotate(90deg);
}

.icon-button {
  margin: 8px;
  width: 2.4em;
  height: 2.4em;
  padding: 4px;
  border: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 90%;
  flex-shrink: unset;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 5px;
}

.icon-button:hover {
  background-color: var(--primary-light);
}

.place-editor-title {
  justify-content: space-between;
  align-items: center;
}
</style>
