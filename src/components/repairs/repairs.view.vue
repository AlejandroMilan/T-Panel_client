<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <div class="d-flex justify-end">
          <v-btn
            :disabled="loading"
            :loading="loading"
            color="primary"
            outlined
            @click="getRepairs"
            class="mr-2"
          >
            <v-icon>mdi-autorenew</v-icon>
            {{ $vuetify.breakpoint.mdAndUp ? "Actualizar" : null }}</v-btn
          >
          <v-btn
            :disabled="loading"
            :loading="loading"
            color="primary"
            @click="showRepairDialog = true"
          >
            <v-icon>mdi-plus</v-icon>
            Nueva reparación</v-btn
          >
          <repairDialog
            v-if="showRepairDialog"
            :show="showRepairDialog"
            @cancel="showRepairDialog = false"
            @repairSaved="repairSaved"
          ></repairDialog>
        </div>
      </v-col>
      <v-col cols="12">
        <repairList :repairs="repairs" :loading="loading"></repairList>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import repairDialog from "./repairDialog";
import repairList from "./repairList";

export default {
  name: "repairsView",

  mixins: [serverRequestMixin],

  components: {
    repairDialog,
    repairList,
  },

  data: () => ({
    loading: false,
    showRepairDialog: false,
    repairs: [],
  }),

  mounted() {
    this.getRepairs();
  },

  methods: {
    async getRepairs() {
      this.loading = true;
      try {
        const response = await this.getRequest("/repairs");
        this.loading = false;
        this.repairs = response.repairs;
      } catch (error) {
        this.loading = false;
        this.deleteError = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    repairSaved(newRepair) {
      this.showRepairDialog = false;
      this.repairs = [newRepair, ...this.repairs];
    },
  },
};
</script>
