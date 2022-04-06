<template>
  <v-card tile flat>
    <v-card-title class="secondary--text"
      >Bienvenid@ {{ user.name.split(" ")[0] }}</v-card-title
    >
    <v-card-text>
      <update-promise></update-promise>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import updatePromise from "./updatePromise.vue";

export default {
  components: {
    "update-promise": updatePromise,
  },

  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
