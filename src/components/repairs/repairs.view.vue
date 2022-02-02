<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-end">
          <div>
            <v-btn
              outlined
              small
              text
              class="mr-1"
              :disabled="validPage === 1"
              @click="prevPage()"
              ><v-icon>mdi-chevron-left</v-icon></v-btn
            >
            <v-btn
              v-if="validPage !== 1"
              outlined
              text
              small
              class="mr-1"
              @click="goToPage(1)"
              ><span>1</span></v-btn
            >
            <v-btn color="primary" small class="mr-1"
              ><span>{{ validPage }}</span></v-btn
            >
            <v-btn
              v-if="validPage !== lastPage && lastPage > 1"
              small
              outlined
              text
              class="mr-2"
              @click="goToPage(lastPage)"
            >
              <span>{{ lastPage }}</span>
            </v-btn>
            <v-btn
              outlined
              small
              text
              :disabled="lastPage === 1"
              @click="nextPage()"
              ><v-icon>mdi-chevron-right</v-icon></v-btn
            >
          </div>
          <div>
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="primary"
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
              :loading="loading"
              color="primary"
              @click="showRepairDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
              Nueva reparación</v-btn
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
      <v-col cols="12">
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
      <v-col v-if="error" cols="12">
        <v-alert type="error" outlined>{{ error }}</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import repairDialog from "./repairDialog";
import repairList from "./repairList";

export default {
  name: "repairsView",

  mixins: [serverRequestMixin],

  components: {
    repairDialog,
    repairList,
  },

  computed: {
    ...mapGetters(["user"]),

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

    lastPage() {
      return parseInt(this.repairsCount / this.validItemsPerPage + 0.999);
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
          `/repairs?itemsPerPage=${this.validItemsPerPage}&page=${this.validPage}`
        );
        this.loading = false;

        this.repairs = response.repairs;
        this.repairsCount = response.count;
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    repairSaved(newRepair) {
      this.showRepairDialog = false;
      this.repairs = [newRepair, ...this.repairs];
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
            page: this.validPage - 1,
            itemsPerPage: this.validItemsPerPage,
          },
        });
    },

    nextPage() {
      console.log("a");
      if (this.validPage < this.lastPage)
        this.$router.push({
          name: "Reparaciones",
          query: {
            page: this.validPage + 1,
            itemsPerPage: this.validItemsPerPage,
          },
        });
    },

    goToPage(number) {
      if (number <= this.lastPage)
        this.$router.push({
          name: "Reparaciones",
          query: {
            page: number,
            itemsPerPage: this.validItemsPerPage,
          },
        });
    },
  },
};
</script>
