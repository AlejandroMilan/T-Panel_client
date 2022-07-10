<template>
  <div class="py-3">
    <v-card flat tile>
      <v-toolbar color="secondary" dark flat dense>
        <v-toolbar-title class="d-flex align-items-center">
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
          <span>Listado de reparaciones</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container v-if="selectedRepairs.length" class="pt-0">
          <v-subheader class="px-0">Acciones disponibles:</v-subheader>
          <div class="flex">
            <v-btn
              v-if="
                user.role.role === 0 ||
                user.permissions.filter((e) => e.key === 331).length > 0
              "
              color="primary"
              @click="openManyRepairsStatusDialog()"
            >
              <v-icon small class="mr-2" color="secondary">mdi-devices</v-icon>
              <span class="secondary--text">Modificar estado</span>
            </v-btn>
            <v-divider vertical></v-divider>
            <v-btn
              v-if="
                (user.role.role === 0 ||
                  user.permissions.filter((e) => e.key === 340).length > 0) &&
                selectedRepairs.length > 1
              "
              color="error"
              class="mx-2"
              @click="openDeleteManyRepairsDialog()"
            >
              <v-icon small class="mr-2">mdi-delete</v-icon>
              <span>Eliminar</span>
            </v-btn>
          </div>
        </v-container>
        <v-data-table
          v-model="selectedRepairs"
          :headers="headers"
          :items="repairs"
          :expanded.sync="expanded"
          single-expand
          :loading="loading"
          loading-text="Cargando..."
          show-select
          no-data-text="No hay reparaciones para mostrar"
          no-results-text="No se encontraron reparaciones"
          hide-default-footer
          item-key="_id"
          show-expand
          disable-sort
          :items-per-page="20"
        >
          <template v-slot:[`item.invoiceId`]="{ item }">
            <v-btn
              color="accent"
              small
              elevation="0"
              tile
              @click="$router.push(`/panel/reparaciones/${item.invoiceId}`)"
            >
              <span class="secondary--text">{{ item.invoiceId }}</span>
            </v-btn>
          </template>
          <template v-slot:[`item.status.title`]="{ item }">
            <v-chip
              :color="
                getStatusColor(
                  repairs.filter((e) => e._id === item._id)[0].status.key
                )
              "
              dark
              label
            >
              {{ repairs.filter((e) => e._id === item._id)[0].status.title }}
            </v-chip>
          </template>
          <template v-slot:[`item.branchOffice.name`]="{ item }">
            <v-chip color="grey" dark label>
              {{ item.branchOffice.name }}
            </v-chip>
          </template>
          <template v-slot:[`item.admissionDate`]="{ item }">
            <span>{{ getShortDateLocal(item.admissionDate) }}</span>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="elevation-0">
              <span class="text-body-2 font-weight-medium"
                >Motivo de ingreso o falla: </span
              ><span class="text-body-2">{{
                item.device.reasonForAdmission
              }}</span>
            </td>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip
              left
              v-if="
                user.role.role === 0 ||
                user.permissions.filter((e) => e.key === 331).length > 0
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="openEditRepairStatusDialog(item)"
                >
                  mdi-devices
                </v-icon>
              </template>
              <span>Modificar estado</span>
            </v-tooltip>

            <v-tooltip
              left
              v-if="
                user.role.role === 0 ||
                user.permissions.filter((e) => e.key === 330).length > 0
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="openMovementDialog(item)"
                >
                  mdi-swap-vertical
                </v-icon>
              </template>
              <span>Agregar movimiento</span>
            </v-tooltip>

            <v-tooltip
              left
              v-if="
                user.role.role === 0 ||
                user.permissions.filter((e) => e.key === 340).length > 0
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="openDeleteRepairStatusDialog(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <updateStatusDialog
      v-if="showEditRepairStatus"
      :show="showEditRepairStatus"
      :invoiceId="invoiceIdToUpdate"
      :currentStatus="repairToAction.status.key"
      @cancel="closeEditRepairStatusDialog"
      @repairSaved="repairSaved"
      @manyRepairsSaved="manyRepairsSaved"
    ></updateStatusDialog>

    <deleteRepairDialog
      v-if="showDeleteRepair"
      :show="showDeleteRepair"
      :invoiceId="invoiceIdToUpdate"
      :deleteQueryString="deleteQueryString"
      @cancel="closeDeleteRepairStatusDialog"
      @repairDeleted="repairDeleted"
      @manyRepairsDeleted="manyRepairsDeleted"
    ></deleteRepairDialog>

    <movement-dialog
      v-if="showMovementDialog"
      :show="showMovementDialog"
      :invoiceId="invoiceIdToUpdate"
      @cancel="closeMovementDialog()"
      @movementSaved="closeMovementDialog()"
    ></movement-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getShortDate } from "@/helpers/date.helper";

import updateStatusDialog from "./updateStatusDialog";
import deleteRepairDialog from "./deleteRepairDialog";

export default {
  name: "repairList",

  props: {
    repairs: {
      type: Array,
      required: true,
    },
    loading: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
  },

  components: {
    updateStatusDialog,
    deleteRepairDialog,
    "movement-dialog": () => import("./movements/addRepairMovement.vue"),
  },

  computed: {
    ...mapGetters(["user"]),

    selectedRepairsInvoices() {
      return this.selectedRepairs.map((e) => e.invoiceId);
    },

    deleteQueryString() {
      return `?invoicesIds=${this.selectedRepairsInvoices.join(
        "&invoicesIds="
      )}`;
    },
  },

  data: () => ({
    expanded: [],
    headers: [
      { text: "Folio", value: "invoiceId" },
      {
        text: "IMEI",
        value: "device.imei",
      },
      {
        text: "Fecha de ingreso",
        value: "admissionDate",
        filterable: false,
      },
      {
        text: "marca",
        value: "device.trademark",
      },
      {
        text: "modelo",
        value: "device.model",
      },
      {
        text: "Cliente",
        value: "customer.name",
      },
      {
        text: "Estado",
        value: "status.title",
      },
      {
        text: "Sucursal",
        value: "branchOffice.name",
      },
      { text: "Acciones", value: "actions", sortable: false },
      { text: "", value: "data-table-expand" },
    ],

    showEditRepairStatus: false,
    repairToAction: null,
    showDeleteRepair: false,
    showMovementDialog: false,

    selectedRepairs: [],
    invoiceIdToUpdate: null,
  }),

  methods: {
    getPageText() {
      return "";
    },

    getStatusColor(statusKey) {
      let color = "red darken-4";
      switch (statusKey) {
        case 400:
          color = "indigo";
          break;
        case 310:
          color = "#1976d2";
          break;
        case 300:
          color = "green darken-3";
          break;
        case 200:
          color = "amber darken-4";
          break;
        case 100:
          color = "red darken-4";
          break;
      }
      return color;
    },

    getShortDateLocal(ISODate) {
      return getShortDate(ISODate);
    },

    openEditRepairStatusDialog(repair) {
      this.repairToAction = repair;
      this.invoiceIdToUpdate = repair.invoiceId;
      this.showEditRepairStatus = true;
    },

    closeEditRepairStatusDialog() {
      this.showEditRepairStatus = false;
      this.invoiceIdToUpdate = null;
      this.repairToAction = null;
    },

    openMovementDialog(repair) {
      this.repairToAction = repair;
      this.invoiceIdToUpdate = repair.invoiceId;
      this.showMovementDialog = true;
    },

    closeMovementDialog() {
      this.showMovementDialog = false;
      this.invoiceIdToUpdate = null;
      this.repairToAction = null;
    },

    repairSaved(repair) {
      this.closeEditRepairStatusDialog();
      this.$emit("repairUpdated", repair);
    },

    openDeleteRepairStatusDialog(repair) {
      this.repairToAction = repair;
      this.invoiceIdToUpdate = repair.invoiceId;
      this.showDeleteRepair = true;
    },

    closeDeleteRepairStatusDialog() {
      this.showDeleteRepair = false;
      this.invoiceIdToUpdate = null;
      this.repairToAction = null;
    },

    repairDeleted(repair) {
      this.closeDeleteRepairStatusDialog();
      this.$emit("repairDeleted", repair);
    },

    openManyRepairsStatusDialog() {
      this.repairToAction = this.selectedRepairs[0];
      this.invoiceIdToUpdate = this.selectedRepairs.map((e) => e.invoiceId);
      this.showEditRepairStatus = true;
    },

    manyRepairsSaved(repairs) {
      this.$emit("manyRepairsSaved", repairs);
      this.selectedRepairs = [];
      this.closeEditRepairStatusDialog();
    },

    openDeleteManyRepairsDialog() {
      this.repairToAction = this.selectedRepairs[0];
      this.invoiceIdToUpdate = this.selectedRepairs.map((e) => e.invoiceId);
      this.showDeleteRepair = true;
    },

    manyRepairsDeleted(repairs) {
      this.$emit("manyRepairsDeleted", repairs);
      this.closeDeleteRepairStatusDialog();
    },
  },
};
</script>
