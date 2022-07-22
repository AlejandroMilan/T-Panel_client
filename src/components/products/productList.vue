<template>
  <div>
    <v-card tile flat :loading="loading">
      <v-toolbar dense flat tile dark color="secondary">
        <v-toolbar-title>
          <span>Listado de productos</span>
        </v-toolbar-title>
      </v-toolbar>
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
              <product-item :product="product"></product-item>
            </v-col>
          </v-row>
        </div>
        <span v-else>Sin productos agregados</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  mixins: [serverRequestMixin],

  components: {
    "product-item": () => import("./productItem.vue"),
  },

  data: () => ({
    loading: true,
    error: "",
    products: [],
  }),

  mounted() {
    this.getProducts();
  },

  methods: {
    async getProducts() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/products");
        this.loading = false;

        this.products = serverResponse.products;
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else this.error = "Error inesperado, favor de contactar con soporte";
        if (error.status >= 500) console.error(error.data);
      }
    },
  },
};
</script>
