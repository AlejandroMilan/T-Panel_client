<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-alert type="error" v-if="!loading && error">
      <v-row align="center">
        <v-col class="grow"> {{ error }} </v-col>
        <v-col class="shrink">
          <v-btn
            color="white"
            outlined
            @click="$router.push({ path: '/panel/reparaciones' })"
            >Volver a "Todas las reparaciones"</v-btn
          >
        </v-col>
      </v-row>
    </v-alert>
    <div v-if="!loading && !error && repair">
      <v-row>
        <v-col cols="12">
          <div class="py-2">
            <deviceData></deviceData>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import deviceData from "./deviceData";

export default {
  name: "RepairView",

  mixins: [serverRequestMixin],

  components: {
    deviceData,
  },

  data: () => ({
    loading: false,
    error: null,
    repairId: "",
    repair: null,
  }),

  mounted() {
    this.repairId = this.$route.params.repairId;
    this.getRepairInfo();
  },

  methods: {
    async getRepairInfo() {
      this.loading = true;
      try {
        const response = await this.getRequest(
          `/repairs/repair/${this.repairId}`
        );
        this.loading = false;
        this.repair = response.repair;
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
