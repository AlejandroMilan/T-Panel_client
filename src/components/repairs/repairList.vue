<template>
  <div class="py-3">
    <v-card outlined>
      <v-card-title>
        <span>Todas las reparaciones</span>
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
          :search="search"
          multi-sort
          no-data-text="No hay reparaciones para mostrar"
          no-results-text="No se encontraron reparaciones"
          :footer-props="{
            itemsPerPageText: 'Elementos por página:',
            itemsPerPageAllText: 'Todos',
            pageText: getPageText(),
            showFirstLastPage: true,
          }"
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
          <template v-slot:[`item.admissionDate`]="{ item }">
            <span>{{ getShortDateLocal(item.admissionDate) }}</span>
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
  },

  data: () => ({
    search: "",
    headers: [
      { text: "Folio", value: "invoiceId" },
      {
        text: "Fecha de igreso (dd/mm/aaaa)",
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
