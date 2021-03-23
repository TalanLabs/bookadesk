<template>
  <div class="label-edit row">
    <div class="view-mode row" v-if="!editMode">
      <div>{{ text }}</div>
      <button
        @click="editMode = true"
        class="label-edit__edit-button icon-button clickable"
      ></button>
    </div>
    <div class="edit-mode row" v-if="editMode">
      <label>
        <input class="label-edit__input" v-model="editedText" />
      </label>
      <button
        @click="save"
        class="label-edit__save-button icon-button"
      ></button>
      <button
        @click="cancel"
        class="label-edit__cancel-button icon-button"
      ></button>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  name: "LabelEditor",
  props: {
    text: String
  },
  data() {
    return {
      editMode: false,
      editedText: this.text
    };
  },
  methods: {
    cancel() {
      this.editMode = false;
    },
    save() {
      this.editMode = false;
      this.$emit("edited", this.editedText);
    }
  }
};
</script>

<style scoped>
.label-edit {
  margin-left: 0.2em;
}
.label-edit__edit-button {
  background-image: url("../assets/edit.svg?inline");
}
.label-edit__save-button {
  background-image: url("../assets/check.svg?inline");
}

.label-edit__cancel-button {
  background-image: url("../assets/cancel.svg?inline");
}

.icon-button {
  margin: 8px;
  width: 2em;
  height: 2em;
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

.label-edit__input {
  max-width: 5em;
}
</style>
