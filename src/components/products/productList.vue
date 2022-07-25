<template>
  <div>
    <v-card tile flat :loading="loading">
      <v-toolbar dense flat tile dark color="secondary">
        <v-toolbar-title>
          <span>Listado de productos</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="hasPermission(520)"
          color="primary"
          :disabled="loading"
          @click="showProductDialog = true"
        >
          <v-icon :small="!isMobile" :class="{ isMobile: 'mr-2' }"
            >mdi-plus</v-icon
          >
          <span v-if="!isMobile">Nuevo producto</span>
        </v-btn>
      </v-toolbar>
      <v-card-title>
        <v-row dense>
          <v-col cols="12" md="6" lg="4">
            <v-text-field
              v-model="search"
              :label="`Buscar (${count} resultados)`"
              hint="Buscar por nombre o SKU"
              outlined
              dense
              color="secondary"
              @keyup.enter="setSearch()"
            >
              <template #append>
                <v-btn
                  color="secondary"
                  small
                  dark
                  :loading="loading"
                  @click="setSearch()"
                >
                  <v-icon small>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <div class="d-flex">
              <v-btn
                color="secondary"
                small
                tile
                class="ma-1"
                :disabled="!canGoBack"
                @click="goToPage(activePage - 1)"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                v-if="canGoBack"
                color="secondary"
                outlined
                dark
                small
                tile
                class="ma-1"
                @click="goToPage(1)"
              >
                <span>1</span>
              </v-btn>
              <v-btn color="primary" dark small tile class="ma-1">
                <span>{{ activePage }}</span>
              </v-btn>
              <v-btn
                v-if="activePage < maxPage"
                color="secondary"
                outlined
                dark
                small
                tile
                class="ma-1"
                @click="goToPage(maxPage)"
              >
                <span>{{ maxPage }}</span>
              </v-btn>
              <v-btn
                color="secondary"
                small
                tile
                class="ma-1"
                :disabled="!canGoNext"
                @click="goToPage(activePage + 1)"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text v-if="!loading">
        <div v-if="products.length">
          <v-row dense>
            <v-col
              cols="12"
              md="6"
              lg="4"
              v-for="product in products"
              :key="product._id"
            >
              <product-item
                :product="product"
                @productDeleted="productDeleted"
              ></product-item>
            </v-col>
          </v-row>
        </div>
        <span v-else>Sin productos agregados</span>
      </v-card-text>
    </v-card>

    <product-dialog
      v-if="showProductDialog"
      :show="showProductDialog"
      @cancel="showProductDialog = false"
      @productSaved="productSaved"
    ></product-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  mixins: [serverRequestMixin],

  components: {
    "product-item": () => import("./productItem.vue"),
    "product-dialog": () => import("./productCreation.vue"),
  },

  data: () => ({
    loading: true,
    error: "",
    products: [],
    search: "",
    count: 0,
    showProductDialog: false,
  }),

  computed: {
    ...mapGetters(["hasPermission"]),

    activePage() {
      const { page } = this.$route.query;
      if (!page) return 1;
      return page;
    },

    canGoBack() {
      return this.activePage > 1;
    },

    maxPage() {
      const itemsPerPage = 20;
      return parseInt(this.count / itemsPerPage + 0.9999999);
    },

    canGoNext() {
      return this.activePage < this.maxPage;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  watch: {
    $route() {
      this.getProducts();
    },
  },

  mounted() {
    this.setCurrentData();
    this.getProducts();
  },

  methods: {
    setCurrentData() {
      const { query } = this.$route;
      if (query.search) this.search = query.search;
    },

    async getProducts() {
      this.loading = true;

      try {
        const { query } = this.$route;
        const serverResponse = await this.getRequest("/products", true, query);
        this.loading = false;

        this.products = serverResponse.products;
        this.count = serverResponse.productsCount;
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else this.error = "Error inesperado, favor de contactar con soporte";
        if (error.status >= 500) console.error(error.data);
      }
    },

    changeQuery(fieldToChange) {
      const { query } = this.$route;
      this.$router.push({
        name: "Productos",
        query: {
          ...query,
          ...fieldToChange,
        },
      });
    },

    setSearch() {
      this.changeQuery({ search: this.search });
    },

    goToPage(page) {
      this.changeQuery({ page });
    },

    productSaved(product) {
      this.products.push(product);
      this.showProductDialog = false;
    },

    productDeleted(product) {
      this.products = this.products.filter((e) => e._id !== product._id);
    },
  },
};
</script>
