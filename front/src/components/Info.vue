<template>
  <div class="info-page">
    <div class="subtitle">Informations et documents</div>
    <WideButton
      class="info-covid-button wide-button"
      @click="openInfoTalan"
      :title="'Infos Covid'"
      subtitle="Documentation Talan"
    >
      <img
        class="info-covid-icon"
        src="info-covid-icon.png"
        alt="info-covid-icon"
      />
    </WideButton>
    <div class="subtitle"></div>
  </div>
</template>

<script>
import WideButton from "@/views/WideButton";
export default {
  name: "Info",
  components: { WideButton },
  methods: {
    openInfoTalan() {
      window.open("https://portail.talan.com/infocovid.html", "_blank");
    },
  },
};
</script>

<style scoped>
.info-page {
  /*max-width: 30em;*/
  align-items: stretch;
  width: 100%;
}
.under-title {
  font-size: 1.8rem;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1em;
}
.wide-button {
  margin-bottom: 1em;
  /*width: 100%;*/
}
.info-covid-icon {
  width: 3.2em;
  max-width: 3.2em;
  height: 3.2em;
  border-radius: 50%;
}
</style>
