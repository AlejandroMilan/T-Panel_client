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
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
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
  },
};
</script>
