<template>
  <div>
    <v-row dense>
      <v-col v-if="error" cols="12">
        <v-alert type="error" outlined>{{ error }}</v-alert>
      </v-col>
      <v-col cols="12">
        <div
          class="d-flex justify-space-between align-end"
          :class="{ 'flex-column-reverse': !$vuetify.breakpoint.mdAndUp }"
        >
          <div :class="{ 'mt-3': !$vuetify.breakpoint.mdAndUp }">
            <v-btn
              color="secondary"
              tile
              small
              class="mr-1"
              :disabled="validPage === 1"
              @click="prevPage()"
              ><v-icon>mdi-chevron-left</v-icon></v-btn
            >
            <v-btn
              v-if="validPage !== 1"
              tile
              color="secondary"
              outlined
              small
              class="mr-1"
              @click="goToPage(1)"
              ><span>1</span></v-btn
            >
            <v-btn color="primary" dark tile small class="mr-1"
              ><span>{{ validPage }}</span></v-btn
            >
            <v-btn
              v-if="validPage !== lastPage && lastPage > 1"
              color="secondary"
              small
              tile
              outlined
              class="mr-1"
              @click="goToPage(lastPage)"
            >
              <span class="secondary--text">{{ lastPage }}</span>
            </v-btn>
            <v-btn
              color="secondary"
              tile
              small
              :disabled="validPage === lastPage"
              @click="nextPage()"
              ><v-icon>mdi-chevron-right</v-icon></v-btn
            >
            <span v-if="!$vuetify.breakpoint.smAndDown" class="ml-2"
              >Resultados: {{ repairsCount }}</span
            >
          </div>
          <div>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="secondary"
              outlined
              @click="getRepairs"
              class="mr-2"
            >
              <v-icon>mdi-autorenew</v-icon>
              {{ $vuetify.breakpoint.mdAndUp ? "Actualizar" : null }}</v-btn
            >
            <v-btn
              v-if="
                user.role.role === 0 ||
                user.permissions.filter((permission) => permission.key === 320)
                  .length > 0
              "
              :disabled="loading"
              color="primary"
              dark
              @click="showRepairDialog = true"
            >
              <v-icon small class="mr-2">mdi-plus</v-icon>
              <span>Nueva reparación</span></v-btn
            >
            <repairDialog
              v-if="showRepairDialog"
              :show="showRepairDialog"
              @cancel="showRepairDialog = false"
              @repairSaved="repairSaved"
            ></repairDialog>
          </div>
        </div>
      </v-col>
      <v-col cols="12" :md="viewFiltersWithFullWith ? '12' : '3'">
        <filters-card
          class="my-3"
          :isLoading="loading"
          :currentQuery="$route.query"
          :isFullWidth="viewFiltersWithFullWith"
          @queryChanged="queryChanged"
        ></filters-card>
      </v-col>
      <v-col cols="12" :md="viewFiltersWithFullWith ? '12' : '9'">
        <repairList
          :repairs="repairs"
          :loading="loading"
          :count="repairsCount"
          @repairUpdated="repairUpdated"
          @repairDeleted="repairDeleted"
          @manyRepairsSaved="manyRepairsSaved"
          @manyRepairsDeleted="manyRepairsDeleted"
        ></repairList>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import repairDialog from "./repairDialog";
import repairList from "./repairList";
import repairsFiltersCard from "./filters/repairsFiltersCard.vue";

export default {
  name: "repairsView",

  mixins: [serverRequestMixin],

  components: {
    repairDialog,
    repairList,
    "filters-card": repairsFiltersCard,
  },

  computed: {
    ...mapGetters(["user", "isNavigating"]),

    validItemsPerPage() {
      const pathItemsPerPage = this.$route.query.itemsPerPage;
      if (pathItemsPerPage * 1) return pathItemsPerPage * 1;
      else return 20;
    },

    validPage() {
      const pathPage = this.$route.query.page;
      if (pathPage * 1) return pathPage * 1;
      else return 1;
    },

    validTextSearch() {
      return this.$route.query.textSearch;
    },

    lastPage() {
      return parseInt(this.repairsCount / this.validItemsPerPage + 0.999);
    },

    validSortValue() {
      return this.$route.query.sortBy || "admissionDate";
    },

    validOrderValue() {
      return this.$route.query.order || "desc";
    },

    parsedQuery() {
      let query = this.$route.query;
      Object.keys(query).forEach((key) => {
        if (!query[key]) delete query[key];
      });

      return query;
    },

    viewFiltersWithFullWith() {
      if (!this.$vuetify.breakpoint.mdAndUp) return true;
      if (
        this.$vuetify.breakpoint.mdAndUp &&
        this.isNavigating &&
        this.$vuetify.breakpoint.lgAndDown
      )
        return true;
      return false;
    },
  },

  data: () => ({
    loading: false,
    showRepairDialog: false,
    repairs: [],
    error: "",
    repairsCount: 0,
  }),

  watch: {
    $route() {
      this.getRepairs();
    },
  },

  mounted() {
    this.getRepairs();
  },

  methods: {
    async getRepairs() {
      this.error = "";
      this.loading = true;
      try {
        const response = await this.getRequest(
          "/repairs",
          true,
          this.parsedQuery
        );
        this.loading = false;

        this.repairs = response.repairs;
        this.repairsCount = response.count;

        if (!this.repairs.length) this.goToPage(1);
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    repairSaved(newRepair) {
      this.showRepairDialog = false;
      this.repairs = [newRepair, ...this.repairs];
      if (newRepair.printTicket)
        this.printRepair({ isTicket: true, repairId: newRepair.invoiceId });
    },

    async printRepair({ isTicket = true, repairId }) {
      this.loading = true;
      this.errorPrint = null;

      try {
        let urlString = `/repairs/repair/${repairId}/pdf`;
        if (isTicket) urlString = urlString + "?type=ticket";

        const serverResponse = await this.getFileRequest(urlString);
        this.loading = false;

        var file = new Blob([serverResponse.file], { type: "application/pdf" });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      } catch (error) {
        this.loading = false;
        if (error.data) this.errorPrint = error.data.message;
        else this.errorPrint = error.message;
        if (error.status >= 500) console.error(error);
      }
    },

    repairUpdated(repair) {
      const query = (element) => element._id === repair._id;
      const index = this.repairs.findIndex(query);
      this.repairs[index] = repair;
    },

    repairDeleted(repair) {
      this.repairs = this.repairs.filter((e) => e._id !== repair._id);
    },

    manyRepairsSaved(repairs) {
      repairs.forEach((repair) => {
        this.repairUpdated(repair);
      });
    },

    manyRepairsDeleted(repairs) {
      repairs.forEach((repair) => {
        this.repairDeleted(repair);
      });
    },

    prevPage() {
      if (this.validPage > 1)
        this.$router.push({
          name: "Reparaciones",
          query: {
            ...this.$route.query,
            page: this.validPage - 1,
            ...(this.$route.query.onlyMyRepairs && { onlyMyRepairs: true }),
            ...(this.$route.query.technician && {
              technician: this.$route.query.technician,
            }),
          },
        });
    },

    nextPage() {
      if (this.validPage < this.lastPage)
        this.$router.push({
          name: "Reparaciones",
          query: {
            ...this.$route.query,
            page: this.validPage + 1,
            ...(this.$route.query.onlyMyRepairs && { onlyMyRepairs: true }),
            ...(this.$route.query.technician && {
              technician: this.$route.query.technician,
            }),
          },
        });
    },

    goToPage(number) {
      if (number <= this.lastPage)
        this.$router.push({
          name: "Reparaciones",
          query: {
            ...this.$route.query,
            page: number,
            ...(this.$route.query.onlyMyRepairs && { onlyMyRepairs: true }),
            ...(this.$route.query.technician && {
              technician: this.$route.query.technician,
            }),
          },
        });
    },

    queryChanged(query) {
      const haveSameData = function (obj1, obj2) {
        const obj1Length = Object.keys(obj1).length;
        const obj2Length = Object.keys(obj2).length;

        if (obj1Length === obj2Length) {
          return Object.keys(obj1).every(
            // eslint-disable-next-line no-prototype-builtins
            (key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]
          );
        }
        return false;
      };

      if (haveSameData(query, this.$route.query)) return;

      this.$router.push({
        name: "Reparaciones",
        query,
      });
    },
  },
};
</script>
