<template>
  <div>
    <v-progress-linear
      v-if="loadingPrint"
      indeterminate
      color="secondary"
    ></v-progress-linear>
    <v-alert type="error" outlined v-if="!loadingPrint && errorPrint">
      <v-row align="center">
        <v-col class="grow"> {{ errorPrint }} </v-col>
      </v-row>
    </v-alert>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="accent"
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
    <div>
      <v-btn text small color="#1976d2" @click="goBack()">
        <v-icon small class="mr-2">mdi-arrow-left</v-icon>
        <span>Volver</span>
      </v-btn>
    </div>
    <div v-if="!loading && !error && repair">
      <v-tabs
        v-model="tab"
        color="primary"
        background-color="secondary"
        dark
        class="mb-2"
      >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab>
          <v-icon class="mr-1">mdi-text-box-outline</v-icon>
          <span>Detalles de la reparación</span>
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">mdi-comment</v-icon>
          <span>Comentarios</span>
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">mdi-swap-vertical</v-icon>
          <span>Movimientos</span>
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">mdi-clock-outline</v-icon>
          <span>Actividad</span>
        </v-tab>
      </v-tabs>
      <v-row>
        <v-col cols="12" md="8" lg="9">
          <div class="py-2">
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <repairData :repairData="{ ...repair, gain }"></repairData>
              </v-tab-item>
              <v-tab-item>
                <commentsList :comments="comments"></commentsList>
              </v-tab-item>
              <v-tab-item>
                <movements-list :movements="movements"></movements-list>
              </v-tab-item>
              <v-tab-item>
                <repairLogs :logs="repair.logs" />
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-card flat tile class="my-2">
            <div v-if="repair.technician">
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="secondary">mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <span>{{ repair.technician.name }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span>Técnico asignado</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-card>
          <actionsCard
            @editRepairInfo="editRepairInfo"
            @editRepairStatus="editRepairStatus"
            @deleteRepair="showDeleteRepairDialog"
            @addComment="addComment"
            @printRepair="printRepair({})"
            @printRepairTicket="printRepair({ isTicket: true })"
            @printRepairSticker="printRepair({ isSticker: true })"
            @downloadRepairPdf="downloadRepairPdf"
            @sendWhatsApp="sendWhatsappDialog = true"
            @showTechnician="showTechnicianDialog"
            @openMovementDialog="showMovementDialog = true"
          ></actionsCard>

          <commentCard
            v-if="comments || comments.length"
            :comment="comments[0]"
            :showFullImage="true"
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

    <sendWhatsApp
      v-if="sendWhatsappDialog"
      :show="sendWhatsappDialog"
      :currentNumber="repair.customer.phoneNumber || ''"
      @cancel="sendWhatsappDialog = false"
    ></sendWhatsApp>

    <technician-dialog
      v-if="showTechnician"
      :show="showTechnician"
      :invoiceId="repair.invoiceId"
      @cancel="showTechnician = false"
      @technicianSelected="technicianSelected"
    ></technician-dialog>

    <movement-dialog
      v-if="showMovementDialog"
      :show="showMovementDialog"
      @cancel="showMovementDialog = false"
      @movementSaved="movementSaved"
    ></movement-dialog>
  </div>
</template>

<script>
import download from "downloadjs";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import repairDialog from "./repairDialog";
import repairData from "./repairData";
import repairMovements from "./movements/repairMovements.vue";
import commentsList from "@/components/comments/commentsList";
import actionsCard from "./actionsCard";
import updateStatusDialog from "./updateStatusDialog";
import deleteRepairDialog from "./deleteRepairDialog";
import commentCard from "@/components/comments/commentCard";
import commentDialog from "@/components/comments/commentDialog";
import sendWhatsApp from "./sendWhatsapp";
import repairLogs from "./repairLogs";

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
    sendWhatsApp,
    repairLogs,
    "movements-list": repairMovements,
    "technician-dialog": () => import("./setTechnicianDialog.vue"),
    "movement-dialog": () => import("./movements/addRepairMovement.vue"),
  },

  data: () => ({
    loading: false,
    loadingPrint: false,
    showEditRepairInfo: false,
    showEditRepairStatus: false,
    showDeleteRepair: false,
    showCommentDialog: false,
    showTechnician: false,
    sendWhatsappDialog: false,
    showMovementDialog: false,
    tab: null,
    error: null,
    errorPrint: null,
    repairId: "",
    repair: null,
    comments: null,
    movements: [],
  }),

  computed: {
    gain() {
      if (!this.repair) return 0;
      const gainMovements = this.movements.filter(
        (e) => e.movementType === "entry"
      );
      const billMovements = this.movements.filter(
        (e) => e.movementType === "bill"
      );

      let gainAmount = 0;
      gainMovements.forEach((e) => {
        gainAmount = gainAmount + e.amount;
      });
      let billAmount = 0;
      billMovements.forEach((e) => {
        billAmount = billAmount + e.amount;
      });

      const gain = gainAmount - billAmount;
      return gain;
    },
  },

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
        const movementsResponse = await this.getRequest(
          `/repairMovements/repair/${this.repairId}`
        );

        this.loading = false;
        this.repair = response.repair;
        this.comments = commentsResponse.comments.reverse();
        this.movements = movementsResponse.movements;
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

    async printRepair({ isTicket = false, isSticker = false }) {
      this.loadingPrint = true;
      this.errorPrint = null;

      try {
        let urlString = `/repairs/repair/${this.repairId}/pdf`;
        if (isTicket) urlString = urlString + "?type=ticket";
        if (isSticker) urlString = urlString + "?type=sticker";

        const serverResponse = await this.getFileRequest(urlString);
        this.loadingPrint = false;

        var file = new Blob([serverResponse.file], { type: "application/pdf" });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      } catch (error) {
        this.loadingPrint = false;
        if (error.data) this.errorPrint = error.data.message;
        else this.errorPrint = error.message;
        if (error.status >= 500) console.error(error);
      }
    },

    async downloadRepairPdf() {
      this.loadingPrint = true;
      this.errorPrint = null;

      try {
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const serverResponse = await this.getFileRequest(
          `/repairs/repair/${this.repairId}/pdf?timezone=${localTimezone}`
        );
        this.loadingPrint = false;

        download(
          serverResponse.file,
          `${this.repairId}.pdf`,
          serverResponse.responseHeaderType
        );
      } catch (error) {
        this.loadingPrint = false;
        if (error.data) this.errorPrint = error.data.message;
        else this.errorPrint = error.message;
        if (error.status >= 500) console.error(error);
      }
    },

    showTechnicianDialog() {
      this.showTechnician = true;
    },

    technicianSelected({ technicianSelected, logs }) {
      this.repair.technician = technicianSelected;
      this.repair.logs = logs;
      this.showTechnician = false;
    },

    movementSaved(movement) {
      this.movements = [movement, ...this.movements];
      this.showMovementDialog = false;
    },

    goBack() {
      window.history.back();
    },
  },
};
</script>
