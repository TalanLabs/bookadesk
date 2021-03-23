<template>
  <div class="wide-button" @click="$emit('click', $event)">
    <div class="button-label">
      <div class="button-title">{{ title }}</div>
      <div class="button-subtitle">
        {{ subtitle }}
      </div>
    </div>

    <slot class="icon"></slot>
  </div>
</template>
<script>
export default {
  name: "WideButton",
  props: {
    title: String,
    subtitle: String,
  },
};
</script>
<style scoped="true">
.wide-button {
  background-color: var(--background-cards);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  align-self: stretch;
}

.wide-button:hover {
  box-shadow: 2px 2px 2px var(--shadow);
}

.button-title {
  font-size: 1.4rem;
  font-weight: 500;
}

.button-subtitle {
  font-size: 1rem;
  overflow-wrap: normal;
}

.button-label {
  margin-right: 1em;
}
</style>
