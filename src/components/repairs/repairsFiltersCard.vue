<template>
  <v-card outlined>
    <v-card-title>Filtros</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <div class="d-flex">
            <v-text-field
              v-model="search"
              dense
              label="Búsqueda"
              hint="Busca por folio, IMEI, dispositivo o cliente."
              :disabled="isLoading"
              @keyup.enter="searchChanged()"
            ></v-text-field>
            <v-btn
              v-if="!search"
              text
              small
              outlined
              class="ml-2 mt-1"
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
    currentSearch: { type: String, required: false },
  },

  data: () => ({
    search: "",
  }),

  watch: {
    currentSearch() {
      this.setCurrentData();
    },
  },

  mounted() {
    this.setCurrentData();
  },

  methods: {
    setCurrentData() {
      if (this.currentSearch) this.search = this.currentSearch || "";
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
