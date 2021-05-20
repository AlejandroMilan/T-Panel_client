<template>
  <div class="py-3">
    <v-card outlined>
      <v-card-title>
        <span>Últimas reparaciones</span>
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
        ></v-data-table>
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
};
</script>
