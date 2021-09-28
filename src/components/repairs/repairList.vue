<template>
  <div class="py-3">
    <v-card outlined>
      <v-card-title>
        <span>{{ `Todas las reparaciones (${repairs.length})` }}</span>
        <v-spacer> </v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar por folio, marca, modelo, cliente o estado"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="repairs"
          :expanded.sync="expanded"
          :search="search"
          single-expand
          :loading="loading"
          loading-text="Cargando..."
          multi-sort
          no-data-text="No hay reparaciones para mostrar"
          no-results-text="No se encontraron reparaciones"
          :footer-props="{
            itemsPerPageText: 'Elementos por página:',
            itemsPerPageAllText: 'Todos',
            pageText: getPageText(),
            showFirstLastPage: true,
          }"
          item-key="_id"
          show-expand
        >
          <template v-slot:[`item.invoiceId`]="{ item }">
            <router-link
              class="link"
              :to="`/panel/reparaciones/${item.invoiceId}`"
              >{{ item.invoiceId }}</router-link
            >
          </template>
          <template v-slot:[`item.status.title`]="{ item }">
            <v-chip
              :color="
                getStatusColor(
                  repairs.filter((e) => e._id === item._id)[0].status.key
                )
              "
              dark
              link
              @click="search = item.status.title"
            >
              {{ repairs.filter((e) => e._id === item._id)[0].status.title }}
            </v-chip>
          </template>
          <template v-slot:[`item.branchOffice.name`]="{ item }">
            <v-chip
              color="grey"
              dark
              link
              @click="search = item.branchOffice.name"
            >
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
            <v-tooltip left>
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

            <v-tooltip left>
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
      :invoiceId="repairToAction.invoiceId"
      :currentStatus="repairToAction.status.key"
      @cancel="closeEditRepairStatusDialog"
      @repairSaved="repairSaved"
    ></updateStatusDialog>

    <deleteRepairDialog
      v-if="showDeleteRepair"
      :show="showDeleteRepair"
      :invoiceId="repairToAction.invoiceId"
      @cancel="closeDeleteRepairStatusDialog"
      @repairDeleted="repairDeleted"
    ></deleteRepairDialog>
  </div>
</template>

<script>
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
  },

  components: { updateStatusDialog, deleteRepairDialog },

  data: () => ({
    search: "",
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
      this.showEditRepairStatus = true;
    },

    closeEditRepairStatusDialog() {
      this.showEditRepairStatus = false;
      this.repairToAction = null;
    },

    repairSaved(repair) {
      this.closeEditRepairStatusDialog();
      this.$emit("repairUpdated", repair);
    },

    openDeleteRepairStatusDialog(repair) {
      this.repairToAction = repair;
      this.showDeleteRepair = true;
    },

    closeDeleteRepairStatusDialog() {
      this.showDeleteRepair = false;
      this.repairToAction = null;
    },

    repairDeleted(repair) {
      this.closeDeleteRepairStatusDialog();
      this.$emit("repairDeleted", repair);
    },
  },
};
</script>
