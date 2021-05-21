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
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "RepairView",

  mixins: [serverRequestMixin],

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
        console.log(response);
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
