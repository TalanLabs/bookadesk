<template>
  <div class="missing-supplies col">
    <div class="title">Indiquer</div>
    <div class="subtitle">du matériel manquant</div>
    <SelectOffice @selectedOffice="loadMissingSupplies"></SelectOffice>
    <div class="section-title">Sélectionner le type de matériel</div>
    <div class="missing-supplies">
      <div class="supplies-types">
        <div
          class="button supplies-type"
          @click="supplyType = 'GEL'"
          :class="{ selected: supplyType === 'GEL' }"
        >
          Gel hydroalcoolique
        </div>
        <div
          class="button supplies-type"
          @click="supplyType = 'WIPES'"
          :class="{ selected: supplyType === 'WIPES' }"
        >
          Lingettes
        </div>
        <div
          class="button supplies-type"
          @click="supplyType = 'OTHER'"
          :class="{ selected: supplyType === 'OTHER' }"
        >
          Autre
        </div>
      </div>
    </div>
    <div class="section-title">Ajouter une description</div>
    <div>Préciser la localisation</div>
    <input
      class="comments-input"
      v-model="comments"
      v-on:keyup.enter="notify"
    />
    <button class="button button-primary" @click="notify">
      Signaler du matériel manquant
    </button>
    <div class="section-title">Signalements</div>
    <div class="missing-supplies-list col">
      <div
        class="missing-supplies-list__row row"
        v-for="item of missingSupplies"
        :key="item.id"
      >
        <div class="missing-supplies-list__notification-date">
          {{ formatDate(item.createdAt) }}
        </div>
        <div class="missing-supplies-list__notification-type">
          {{ getTypeLabel(item.type) }}
        </div>
        <div class="missing-supplies-list__notification-comments">
          {{ item.comments }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, fromUnixTime } from "date-fns";
import { fr } from "date-fns/locale";
import SelectOffice from "@/components/SelectOffice";
import { getMissingSupplies, notifyMissingSupplies } from "@/services";

export default {
  name: "MissingSupplies",
  components: { SelectOffice },
  data() {
    return {
      comments: "",
      missingSupplies: [],
      supplyType: "GEL",
    };
  },
  created() {
    this.loadMissingSupplies();
  },
  methods: {
    getTypeLabel(type) {
      switch (type) {
        case "GEL":
          return "Gel";
        case "WIPES":
          return "Lingettes";
        case "OTHER":
          return "Autre";
      }
    },
    formatDate(timestamp) {
      const date = fromUnixTime(timestamp / 1000);
      return format(date, "eee dd MMMM", { locale: fr });
    },
    async loadMissingSupplies() {
      this.missingSupplies = await getMissingSupplies(
        this.$store.getters.selectedOffice
      );
    },
    async notify() {
      await notifyMissingSupplies(
        this.$store.getters.selectedOffice,
        this.supplyType,
        this.comments
      );
      this.supplyType = "GEL";
      this.comments = "";
      await this.loadMissingSupplies();
    },
  },
};
</script>

<style scoped>
.missing-supplies {
  max-width: 35em;
  width: 85%;
}

.supplies-types {
  display: flex;
  flex-direction: row;
  align-items: center;
}

@media (max-width: 600px) {
  .supplies-types {
    flex-direction: column;
  }
}
.supplies-type {
  margin: 8px;
}

.missing-supplies-list > * {
  padding: 4px;
}

.missing-supplies-list__notification-date {
  width: 25%;
}

.missing-supplies-list__notification-type {
  width: 15%;
}

.comments-input {
  align-self: stretch;
  margin: 16px 0;
}

.selected {
  border: 1px solid var(--primary);
}
</style>
