<template>
  <div>
    <v-progress-linear
      indeterminate
      v-if="loading"
      color="primary"
    ></v-progress-linear>
    <v-row v-else dense>
      <v-col cols="12">
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            outlined
            :loading="loading"
            :disabled="loading"
            @click="getBranches"
          >
            <v-icon small>mdi-autorenew</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Actualizar</span>
          </v-btn>
          <v-btn color="primary" class="ml-2" @click="showBranchDialog = true">
            <v-icon>mdi-plus</v-icon>
            <span>Agregar sucursal</span>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="6" v-for="(branch, index) in branches" :key="index">
        <branchOfficeCard :branchOffice="branch"></branchOfficeCard>
      </v-col>
    </v-row>

    <branchOfficeDialog
      v-if="showBranchDialog"
      :show="showBranchDialog"
      @cancel="showBranchDialog = false"
      @branchSaved="branchSaved"
    ></branchOfficeDialog>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import branchOfficeCard from "./branchOfficeCard";
import branchOfficeDialog from "./branchOfficeDialog";

export default {
  name: "branchOfficesView",

  mixins: [serverRequestMixin],

  components: { branchOfficeCard, branchOfficeDialog },

  data: () => ({
    loading: false,
    error: null,
    branches: [],
    showBranchDialog: false,
  }),

  mounted() {
    this.getBranches();
  },

  methods: {
    async getBranches() {
      try {
        this.loading = true;

        const serverResponse = await this.getRequest("/branchOffices");
        this.loading = false;

        this.branches = serverResponse.branchOffices;
      } catch (error) {
        this.loading = false;
        error.status < 500
          ? (this.error = error.data.message)
          : console.error(error);
      }
    },

    branchSaved(newBranch) {
      this.showBranchDialog = false;
      this.branches = [...this.branches, newBranch];
    },
  },
};
</script>
