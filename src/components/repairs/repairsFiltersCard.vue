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
              :disabled="isLoading || loading"
              @keyup.enter="queryChanged()"
            ></v-text-field>
            <v-btn
              v-if="!search"
              small
              tile
              outlined
              color="secondary"
              class="mt-1"
              :class="{ 'ml-2': !isMobile }"
              :disabled="isLoading || loading"
              @click="queryChanged()"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn
              v-else
              small
              color="secondary"
              tile
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
                item-color="secondary"
                :disabled="isLoading || loading"
                @change="queryChanged()"
              ></v-select>
              <v-select
                v-model="order"
                dense
                label="Tipo de orden"
                :items="orderValues"
                item-text="text"
                item-value="value"
                color="secondary"
                item-color="secondary"
                :class="{ 'ml-2': isFullWidth && !isMobile }"
                :disabled="isLoading || loading"
                @change="queryChanged()"
              ></v-select>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" :md="isFullWidth ? '4' : '12'">
          <v-select
            v-model="status"
            multiple
            no-data-text="Sin estados disponibles"
            :items="statusValues"
            item-value="key"
            item-text="title"
            color="secondary"
            item-color="secondary"
            dense
            label="Estado"
            @change="queryChanged()"
            :disabled="isLoading || loading"
          ></v-select>
        </v-col>
        <v-col
          v-if="hasPermission(321)"
          cols="12"
          :md="isFullWidth ? '4' : '12'"
        >
          <v-select
            v-model="branchOffice"
            no-data-text="Sin sucursales disponibles"
            :items="branchOffices"
            item-value="_id"
            item-text="name"
            color="secondary"
            item-color="secondary"
            dense
            label="Sucursal"
            :disabled="isLoading || loading"
            :append-icon="branchOffice ? 'mdi-close' : 'mdi-chevron-down'"
            @click:append="clearBranchOffice()"
            @change="queryChanged()"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "repairsFiltersCard",

  mixins: [serverRequestMixin],

  props: {
    isLoading: { type: Boolean, default: false },
    isFullWidth: { type: Boolean, default: false },
    currentQuery: { type: Object, default: () => null },
  },

  data: () => ({
    loading: false,
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
    statusValues: [],
    status: [],
    branchOffices: [],
    branchOffice: "",
  }),

  computed: {
    ...mapGetters(["hasPermission"]),

    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },

  watch: {
    currentQuery() {
      this.setCurrentData();
    },
  },

  async mounted() {
    await this.getStatus();
    if (this.hasPermission(321)) await this.getBranchOffices();
    this.setCurrentData();
  },

  methods: {
    setCurrentData() {
      if (this.currentQuery) {
        if (typeof this.currentQuery.textSearch === "string")
          this.search = this.currentQuery.textSearch;
        if (this.currentQuery.order) this.order = this.currentQuery.order;
        if (this.currentQuery.sortBy) this.sortBy = this.currentQuery.sortBy;
        if (typeof this.currentQuery.branchOffice === "string")
          this.branchOffice = this.currentQuery.branchOffice;

        if (this.currentQuery.status) {
          if (Array.isArray(this.currentQuery.status))
            this.status = this.currentQuery.status.map((e) => Number(e));
          else this.status = [Number(this.currentQuery.status)];
        }
      } else {
        this.search = "";
      }
    },

    clearSearch() {
      this.search = "";
      this.queryChanged();
    },

    clearBranchOffice() {
      this.branchOffice = "";
      this.queryChanged();
    },

    queryChanged() {
      const query = {
        ...(typeof this.search === "string" && { textSearch: this.search }),
        ...(this.order && { order: this.order }),
        ...(this.sortBy && { sortBy: this.sortBy }),
        ...(typeof this.branchOffice === "string" && {
          branchOffice: this.branchOffice,
        }),
      };
      if (this.status) {
        query.status = this.status.length > 1 ? this.status : this.status[0];
      }

      this.$emit("queryChanged", query);
    },

    async getStatus() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/status");
        this.loading = false;

        this.statusValues = serverResponse.status;
      } catch (error) {
        console.error(error);
      }
    },

    async getBranchOffices() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/branchOffices");
        this.loading = false;

        this.branchOffices = serverResponse.branchOffices;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
