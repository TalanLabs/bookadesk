<template>
  <div class="flex items-center flex-col"></div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GroupsList",
  components: {},
  computed: {
    ...mapGetters([])
  },
  methods: {},
  data() {
    return {
      groupsList: ""
    };
  }
};
</script>

<style scoped="true"></style>
