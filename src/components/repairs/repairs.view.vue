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
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((permission) => permission.key === 320)
                .length > 0
            "
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
        <repairList
          :repairs="repairs"
          :loading="loading"
          @repairUpdated="repairUpdated"
          @repairDeleted="repairDeleted"
        ></repairList>
      </v-col>
      <v-col v-if="error" cols="12">
        <v-alert type="error" outlined>{{ error }}</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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

  computed: {
    ...mapGetters(["user"]),
  },

  data: () => ({
    loading: false,
    showRepairDialog: false,
    repairs: [],
    error: "",
  }),

  mounted() {
    this.getRepairs();
  },

  methods: {
    async getRepairs() {
      this.error = "";
      this.loading = true;
      try {
        const response = await this.getRequest("/repairs");
        this.loading = false;
        this.repairs = response.repairs;
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    repairSaved(newRepair) {
      this.showRepairDialog = false;
      this.repairs = [newRepair, ...this.repairs];
    },

    repairUpdated(repair) {
      const query = (element) => element._id === repair._id;
      const index = this.repairs.findIndex(query);
      this.repairs[index] = repair;
    },

    repairDeleted(repair) {
      this.repairs = this.repairs.filter((e) => e._id !== repair._id);
    },
  },
};
</script>
