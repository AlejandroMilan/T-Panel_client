<template>
  <div>
    <v-progress-linear
      v-if="loadingPrint"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-alert type="error" outlined v-if="!loadingPrint && errorPrint">
      <v-row align="center">
        <v-col class="grow"> {{ errorPrint }} </v-col>
      </v-row>
    </v-alert>
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
            small
            @click="$router.push({ path: '/panel/reparaciones' })"
            >Volver a "Todas las reparaciones"</v-btn
          >
        </v-col>
      </v-row>
    </v-alert>
    <div v-if="!loading && !error && repair">
      <v-tabs v-model="tab" class="mb-2">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab>Detalles de la reparación</v-tab>
        <v-tab>Comentarios</v-tab>
      </v-tabs>
      <v-row>
        <v-col cols="12" md="8" lg="9">
          <div class="py-2">
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <repairData :repairData="repair"></repairData>
              </v-tab-item>
              <v-tab-item>
                <commentsList :comments="comments"></commentsList>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <actionsCard
            @editRepairInfo="editRepairInfo"
            @editRepairStatus="editRepairStatus"
            @deleteRepair="showDeleteRepairDialog"
            @addComment="addComment"
            @printRepair="printRepair"
            @downloadRepairPdf="downloadRepairPdf"
          ></actionsCard>

          <commentCard
            v-if="comments || comments.length"
            :comment="comments[0]"
          ></commentCard>
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
      :currentStatus="repair.status.key"
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

    <commentDialog
      v-if="showCommentDialog"
      :show="showCommentDialog"
      :invoiceId="repair.invoiceId"
      @cancel="showCommentDialog = false"
      @commentSaved="commentSaved"
    ></commentDialog>
  </div>
</template>

<script>
import download from "downloadjs";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import repairDialog from "./repairDialog";
import repairData from "./repairData";
import commentsList from "@/components/comments/commentsList";
import actionsCard from "./actionsCard";
import updateStatusDialog from "./updateStatusDialog";
import deleteRepairDialog from "./deleteRepairDialog";
import commentCard from "@/components/comments/commentCard";
import commentDialog from "@/components/comments/commentDialog";

export default {
  name: "RepairView",

  mixins: [serverRequestMixin],

  components: {
    repairDialog,
    repairData,
    actionsCard,
    updateStatusDialog,
    deleteRepairDialog,
    commentsList,
    commentCard,
    commentDialog,
  },

  data: () => ({
    loading: false,
    loadingPrint: false,
    showEditRepairInfo: false,
    showEditRepairStatus: false,
    showDeleteRepair: false,
    showCommentDialog: false,
    tab: null,
    error: null,
    errorPrint: null,
    repairId: "",
    repair: null,
    comments: null,
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
        const commentsResponse = await this.getRequest(
          `/comments/${this.repairId}`
        );

        this.loading = false;
        this.repair = response.repair;
        this.comments = commentsResponse.comments.reverse();
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

    addComment() {
      this.showCommentDialog = true;
    },

    commentSaved(newComment) {
      this.showCommentDialog = false;
      this.comments = [newComment, ...this.comments];
    },

    async printRepair() {
      this.loadingPrint = true;
      this.errorPrint = null;

      try {
        const serverResponse = await this.getFileRequest(
          `/repairs/repair/${this.repairId}/pdf`
        );
        this.loadingPrint = false;

        var file = new Blob([serverResponse.file], { type: "application/pdf" });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      } catch (error) {
        this.loadingPrint = false;
        if (error.status === 400)
          this.errorPrint =
            "Para crear una nota, el negocio debe tener un logo";
        if (error.status >= 500) console.error(error);
      }
    },

    async downloadRepairPdf() {
      this.loadingPrint = true;
      this.errorPrint = null;

      try {
        const serverResponse = await this.getFileRequest(
          `/repairs/repair/${this.repairId}/pdf`
        );
        this.loadingPrint = false;

        download(
          serverResponse.file,
          `${this.repairId}.pdf`,
          serverResponse.responseHeaderType
        );
      } catch (error) {
        this.loadingPrint = false;
        if (error.status === 400)
          this.errorPrint =
            "Para crear una nota, el negocio debe tener un logo";
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
