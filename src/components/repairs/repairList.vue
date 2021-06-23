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
          <template v-slot:[`item.status.title`]="{ item }">
            <v-chip
              :color="getStatusColor(item.status.key)"
              dark
              link
              @click="search = item.status.title"
            >
              {{ item.status.title }}
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
                  @click="
                    $router.push({
                      path: `/panel/reparaciones/${item.invoiceId}`,
                    })
                  "
                >
                  mdi-more
                </v-icon>
              </template>
              <span>Ver más</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getShortDate } from "@/helpers/date.helper";

export default {
  name: "repairList",

  props: {
    repairs: {
      type: Array,
      required: true,
    },
    loading: { type: Boolean, default: false },
  },

  data: () => ({
    search: "",
    expanded: [],
    headers: [
      { text: "Folio", value: "invoiceId" },
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
  },
};
</script>
