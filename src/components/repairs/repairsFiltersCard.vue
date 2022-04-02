<template>
  <v-card tile flat>
    <v-card-title v-if="false">Filtros</v-card-title>
    <v-toolbar color="secondary" dark dense flat>
      <v-toolbar-title>Filtros</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pt-5">
      <v-row dense>
        <v-col cols="12">
          <div
            class="d-flex flex-wrap"
            :class="{ 'flex-column': isFullWidth && isMobile }"
          >
            <v-text-field
              v-model="search"
              dense
              label="Búsqueda"
              hint="Busca por folio, IMEI, dispositivo o cliente."
              color="secondary"
              :disabled="isLoading"
              @keyup.enter="searchChanged()"
            ></v-text-field>
            <v-btn
              v-if="!search"
              text
              small
              outlined
              class="mt-1"
              :class="{ 'ml-2': !isMobile }"
              :disabled="isLoading"
              @click="searchChanged()"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn
              v-else
              text
              small
              outlined
              class="ml-2 mt-1"
              @click="clearSearch()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <div
              class="d-flex flex-wrap"
              :class="{
                'flex-column': isFullWidth && isMobile,
                'mt-5': !isFullWidth || isMobile,
                'ml-5': isFullWidth && !isMobile,
              }"
            >
              <v-select
                v-model="sortBy"
                dense
                label="Ordenar por"
                :items="sortValues"
                item-text="text"
                item-value="value"
                color="secondary"
                :disabled="isLoading"
              ></v-select>
              <v-select
                v-model="order"
                dense
                label="Tipo de orden"
                :items="orderValues"
                item-text="text"
                item-value="value"
                color="secondary"
                :class="{ 'ml-2': isFullWidth && !isMobile }"
                :disabled="isLoading"
              ></v-select>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "repairsFiltersCard",

  props: {
    isLoading: { type: Boolean, default: false },
    isFullWidth: { type: Boolean, default: false },
    currentSearch: { type: String, required: false },
    currentSort: { type: String, required: true },
    currentOrder: { type: String, required: true },
  },

  data: () => ({
    search: "",
    sortValues: [
      {
        text: "Fecha de ingreso",
        value: "admissionDate",
      },
      {
        text: "Número de folio",
        value: "invoiceId",
      },
    ],
    orderValues: [
      {
        text: "Descendiente",
        value: "desc",
      },
      {
        text: "Ascendiente",
        value: "asc",
      },
    ],
    sortBy: "admissionDate",
    order: "desc",
  }),

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },

  watch: {
    currentSearch() {
      this.setCurrentData();
    },

    sortBy(value) {
      this.$emit("sortChanged", value);
    },

    order(value) {
      this.$emit("orderChanged", value);
    },
  },

  mounted() {
    this.setCurrentData();
  },

  methods: {
    setCurrentData() {
      if (this.currentSearch) this.search = this.currentSearch || "";
      if (this.currentSort) this.sortBy = this.currentSort || "admissionDate";
      if (this.currentOrder) this.order = this.currentOrder || "desc";
    },

    clearSearch() {
      this.search = "";
      this.searchChanged();
    },

    searchChanged() {
      this.$emit("searchChanged", this.search);
    },
  },
};
</script>
