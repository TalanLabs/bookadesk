<template>
  <div class="flex justify-center text-2xl text-blue-800 ">
    Groupes
    <br />
    <div>
      <input
        v-model="groupName"
        placeholder="Nom du groupe"
        v-on:keyup.enter="() => createGroup(groupName)"
        required
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createGroup } from "@/services";

export default {
  name: "EditGroups",
  components: {},
  computed: {
    ...mapGetters([])
  },
  methods: {
    async createGroup(name) {
      console.log(name);
      await createGroup(name);
    }
  },
  data() {
    return {
      groupName: ""
    };
  }
};
</script>

<style scoped="true"></style>
