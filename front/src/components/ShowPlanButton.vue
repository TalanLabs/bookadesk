<template>
  <div class="show-plan-button" @click="$emit('clicked')"></div>
</template>

<script>
export default {
  name: "ShowPlanButton"
};
</script>

<style scoped>
.show-plan-button {
  min-width: 4.5em;
  width: 4.5em;
  height: 4.1em;
  background-image: url("../assets/place.svg?inline");
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
  border: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  flex-shrink: unset;
  cursor: pointer;
}

.show-plan-button:hover {
  opacity: 0.7;
}
</style>
