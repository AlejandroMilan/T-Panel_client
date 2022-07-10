<template>
  <div>
    <v-alert v-if="error" type="error" class="my-3">{{ error }}</v-alert>
    <welcome-card
      :loading="loading"
      :repairsStatusCount="repairsStatusCount"
    ></welcome-card>

    <div v-if="showMovements">
      <movements-info
        v-if="!loading"
        :movementsInfo="movementsInfo"
        class="mt-5"
      ></movements-info>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin.js";

import welcomeCard from "./welcomeCard.vue";
import movementsStats from "./movementsStats.vue";

export default {
  name: "homeView",

  mixins: [serverRequestMixin],

  components: {
    "welcome-card": welcomeCard,
    "movements-info": movementsStats,
  },

  data: () => ({
    error: "",
    loading: true,
    repairsStatusCount: null,
    movementsInfo: null,
  }),

  computed: {
    ...mapGetters(["isRole"]),

    showMovements() {
      return this.isRole(0) || this.isRole(1);
    },
  },

  mounted() {
    this.getDashboard();
  },

  methods: {
    async getDashboard() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/business/dashboard");
        this.loading = false;

        this.repairsStatusCount = serverResponse.repairsStatusCount;
        this.movementsInfo = serverResponse.movementsInfo;
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else this.error = "Error al establecer conexión con el servidor";
      }
    },
  },
};
</script>
