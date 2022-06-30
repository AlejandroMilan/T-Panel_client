<template>
  <v-card tile flat>
    <v-card-title v-if="false">Filtros</v-card-title>
    <v-toolbar color="secondary" dark dense flat>
      <v-toolbar-title class="d-flex align-items-center">
        <v-icon class="mr-2">mdi-tune</v-icon>
        <span>Filtros</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pt-5">
      <v-row dense>
        <v-col cols="12" :md="!isFullWidth ? '12' : '6'">
          <v-text-field
            v-model="search"
            dense
            outlined
            label="Búsqueda"
            hint="Busca por folio, IMEI, dispositivo o cliente."
            color="secondary"
            :disabled="isLoading || loading"
            @keyup.enter="queryChanged()"
          >
            <template #append class="ma-0 pa-0">
              <div class="d-flex align-center" style="height: 100%">
                <v-btn
                  v-if="!search"
                  color="secondary"
                  x-small
                  class="mt-1"
                  :class="{ 'ml-2': !isMobile }"
                  :disabled="isLoading || loading"
                  @click="queryChanged()"
                >
                  <v-icon small>mdi-magnify</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  color="secondary"
                  x-small
                  class="ml-2 mt-1"
                  @click="clearSearch()"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" :md="!isFullWidth ? '12' : '3'">
          <v-select
            v-model="sortBy"
            dense
            label="Ordenar por"
            prepend-inner-icon="mdi-sort"
            :items="sortValues"
            item-text="text"
            item-value="value"
            color="secondary"
            item-color="secondary"
            :disabled="isLoading || loading"
            outlined
            @change="queryChanged()"
          ></v-select>
        </v-col>
        <v-col cols="12" :md="!isFullWidth ? '12' : '3'">
          <v-select
            v-model="order"
            dense
            label="Tipo de orden"
            prepend-inner-icon="mdi-sort-variant"
            :items="orderValues"
            item-text="text"
            item-value="value"
            color="secondary"
            item-color="secondary"
            :class="{ 'ml-2': isFullWidth && !isMobile }"
            :disabled="isLoading || loading"
            outlined
            @change="queryChanged()"
          ></v-select>
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
            prepend-inner-icon="mdi-devices"
            @change="queryChanged()"
            :disabled="isLoading || loading"
            outlined
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
            prepend-inner-icon="mdi-store"
            :disabled="isLoading || loading"
            outlined
            :append-icon="branchOffice ? 'mdi-close' : 'mdi-chevron-down'"
            @click:append="clearBranchOffice()"
            @change="queryChanged()"
          ></v-select>
        </v-col>
        <v-col
          v-if="user.role.role == 3"
          cols="12"
          :md="isFullWidth ? '4' : '12'"
        >
          <v-checkbox
            v-model="onlyMyRepairs"
            :disabled="loading"
            dense
            color="primary"
            label="Solo asignadas a mí"
            @change="queryChanged()"
          ></v-checkbox>
        </v-col>
        <v-col
          v-if="user.role.role != 3"
          cols="12"
          :md="isFullWidth ? '4' : '12'"
        >
          <v-select
            v-model="technician"
            no-data-text="Sin técnicos registrados"
            :items="technicians"
            item-value="_id"
            item-text="name"
            color="secondary"
            item-color="secondary"
            dense
            label="Técnico asignado"
            prepend-inner-icon="mdi-account"
            :disabled="isLoading || loading"
            outlined
            :append-icon="technician ? 'mdi-close' : 'mdi-chevron-down'"
            @click:append="
              technician = '';
              queryChanged();
            "
            @change="queryChanged()"
          ></v-select>
        </v-col>
      </v-row>
      <dates-filters
        :since="since"
        :until="until"
        :isFullWidth="isFullWidth"
        @queryPropChanged="dateChanged"
      ></dates-filters>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import datesFilters from "./dates.repairFilter.vue";

export default {
  name: "repairsFiltersCard",

  mixins: [serverRequestMixin],

  components: {
    "dates-filters": datesFilters,
  },

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
    onlyMyRepairs: false,
    technicians: [],
    technician: "",
    since: "",
    until: "",
  }),

  computed: {
    ...mapGetters(["hasPermission", "user"]),

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
    if (this.user.role.role != 3) await this.getTechnicians();
    this.setCurrentData();
  },

  methods: {
    setCurrentData() {
      if (this.currentQuery && Object.entries(this.currentQuery).length) {
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

        if (this.currentQuery.onlyMyRepairs) this.onlyMyRepairs = true;

        if (this.currentQuery.technician)
          this.technician = this.currentQuery.technician;
        else this.technician = "";

        if (this.currentQuery.since) this.since = this.currentQuery.since;
        if (this.currentQuery.until) this.until = this.currentQuery.until;
      } else {
        this.search = "";
        this.order = this.orderValues[0].value;
        this.sortBy = this.sortValues[0].value;
        this.branchOffice = "";
        this.status = [];
        this.onlyMyRepairs = false;
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
        ...(this.onlyMyRepairs && { onlyMyRepairs: this.onlyMyRepairs }),
        technician: this.technician,
        ...(this.since && { since: this.since }),
        ...(this.until && { until: this.until }),
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

    async getTechnicians() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest(
          `/users/byBusiness/${this.user.businessId}`,
          true,
          { role: 3 }
        );
        this.loading = false;

        if (serverResponse.users.length)
          this.technicians = serverResponse.users;
      } catch (error) {
        console.error(error);
      }
    },

    dateChanged(propChanged) {
      if (propChanged.since) this.since = propChanged.since;
      if (propChanged.until) this.until = propChanged.until;
      this.queryChanged();
    },
  },
};
</script>
