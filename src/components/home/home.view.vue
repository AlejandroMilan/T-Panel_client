<template>
  <div>
    <v-alert v-if="error" type="error" class="my-3">{{ error }}</v-alert>
    <welcome-card
      :loading="loading"
      :repairsStatusCount="repairsStatusCount"
    ></welcome-card>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin.js";

import welcomeCard from "./welcomeCard.vue";

export default {
  name: "homeView",

  mixins: [serverRequestMixin],

  components: {
    "welcome-card": welcomeCard,
  },

  data: () => ({
    error: "",
    loading: false,
    repairsStatusCount: null,
  }),

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
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else this.error = "Error al establecer conexión con el servidor";
      }
    },
  },
};
</script>
