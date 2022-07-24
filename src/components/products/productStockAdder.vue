<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card :loading="loading">
      <v-card-title>
        <span>{{ product.name }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col v-if="error" cols="12">
            <v-alert type="error" outlined>{{ error }}</v-alert>
          </v-col>
          <v-col cols="12">
            <v-row v-for="(stockItem, index) in stock" :key="index" dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="stockItem.branchOfficeName"
                  readonly
                  label="Sucursal"
                  color="secondary"
                  :outlined="index % 2 == 0"
                  :filled="index % 2 != 0"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="stockItem.currentExistences"
                  readonly
                  label="Stock actual"
                  color="secondary"
                  :outlined="index % 2 == 0"
                  :filled="index % 2 != 0"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="stockItem.existences"
                  label="A sumar"
                  color="secondary"
                  :outlined="index % 2 == 0"
                  :filled="index % 2 != 0"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="secondary"
              outlined
              class="mr-2"
              @click="$emit('cancel')"
            >
              <span>Cancelar</span>
            </v-btn>
            <v-btn color="primary" :loading="loading" @click="submit()">
              <v-icon small class="mr-2">mdi-content-save</v-icon>
              <span>Guardar</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin.js";

export default {
  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    product: { type: Object, required: true },
  },

  data: () => ({
    loading: false,
    error: "",
    branchOffices: [],
    stock: [],
    productLocal: null,
  }),

  mounted() {
    this.getBranchOffices();
  },

  methods: {
    async getBranchOffices() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/branchOffices");
        this.loading = false;

        const { branchOffices } = serverResponse;
        this.stock = branchOffices.map((branchOffice) => {
          const inStock = this.product.stock.find(
            (e) => e.branchOffice._id === branchOffice._id
          );

          return {
            branchOffice: branchOffice._id,
            branchOfficeName: branchOffice.name,
            currentExistences: inStock ? inStock.existences : 0,
            existences: 0,
          };
        });
      } catch (error) {
        this.handleResponseError(error);
      }
    },

    async submit() {
      this.loading = true;

      try {
        for (let stockItem of this.stock) {
          const body = {
            branchOffice: stockItem.branchOffice,
            existences: stockItem.existences,
          };
          const serverResponse = await this.putRequest(
            `/products/product/${this.product._id}/stock`,
            body
          );
          this.productLocal = serverResponse.product;
        }

        this.loading = false;
        this.$emit("productSaved", this.productLocal);
      } catch (error) {
        this.handleResponseError(error);
      }
    },
  },
};
</script>
