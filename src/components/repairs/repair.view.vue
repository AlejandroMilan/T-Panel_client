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
        <v-col cols="12" md="8" lg="9">
          <div class="py-2">
            <v-tabs v-model="tab" class="mb-2">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab>Detalles de la reparación</v-tab>
              <v-tab>Comentarios</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <repairData :repairData="repair"></repairData>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <actionsCard
            @editRepairInfo="editRepairInfo"
            @editRepairStatus="editRepairStatus"
            @deleteRepair="showDeleteRepairDialog"
          ></actionsCard>
        </v-col>
      </v-row>
    </div>

    <repairDialog
      v-if="showEditRepairInfo"
      :show="showEditRepairInfo"
      :repair="repair"
      @cancel="showEditRepairInfo = false"
      @repairSaved="repairSaved"
    ></repairDialog>

    <updateStatusDialog
      v-if="showEditRepairStatus"
      :show="showEditRepairStatus"
      :invoiceId="repair.invoiceId"
      @cancel="showEditRepairStatus = false"
      @repairSaved="repairSaved"
    ></updateStatusDialog>

    <deleteRepairDialog
      v-if="showDeleteRepair"
      :show="showDeleteRepair"
      :invoiceId="repair.invoiceId"
      @cancel="showDeleteRepair = false"
      @repairDeleted="repairDeleted"
    ></deleteRepairDialog>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import repairDialog from "./repairDialog";
import repairData from "./repairData";
import actionsCard from "./actionsCard";
import updateStatusDialog from "./updateStatusDialog";
import deleteRepairDialog from "./deleteRepairDialog";

export default {
  name: "RepairView",

  mixins: [serverRequestMixin],

  components: {
    repairDialog,
    repairData,
    actionsCard,
    updateStatusDialog,
    deleteRepairDialog,
  },

  data: () => ({
    loading: false,
    showEditRepairInfo: false,
    showEditRepairStatus: false,
    showDeleteRepair: false,
    tab: null,
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

    editRepairInfo() {
      this.showEditRepairInfo = true;
    },

    editRepairStatus() {
      this.showEditRepairStatus = true;
    },

    repairSaved(repairUpdated) {
      this.showEditRepairInfo = false;
      this.showEditRepairStatus = false;
      this.repair = repairUpdated;
    },

    showDeleteRepairDialog() {
      this.showDeleteRepair = true;
    },

    repairDeleted() {
      this.showDeleteRepair = false;
      this.$router.push({ path: "/panel/reparaciones" });
    },
  },
};
</script>
