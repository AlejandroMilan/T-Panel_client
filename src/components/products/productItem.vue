<template>
  <div>
    <v-card outlined tile>
      <v-card-title>
        <span class="secondary--text">{{ productLocal.name }}</span>
        <v-spacer></v-spacer>
        <product-menu
          @updateProductInfo="showModificationDialog = true"
          @addStockToBranchOffice="showStockDialog = true"
        ></product-menu>
      </v-card-title>
      <v-card-subtitle>
        <div class="py-1">
          <span>SKU: {{ productLocal.sku }}</span>
        </div>
        <v-chip label>{{ currencyFormat(productLocal.unitCost) }}</v-chip>
        <v-chip label class="ml-2" color="secondary lighten-2"
          >{{ totalStock }} piezas totales</v-chip
        >
      </v-card-subtitle>
      <v-card-text>
        <v-btn
          v-if="showStock"
          text
          color="secondary"
          small
          @click="showStock = false"
        >
          <v-icon small class="mr-2">mdi-chevron-down</v-icon>
          <span>Ocultar existencias</span>
        </v-btn>
        <v-btn v-else text color="secondary" small @click="showStock = true">
          <v-icon small class="mr-2">mdi-chevron-right</v-icon>
          <span>Ver existencias</span>
        </v-btn>

        <div v-if="showStock">
          <v-list v-if="productLocal.stock.length">
            <v-list-item
              v-for="stockItem in productLocal.stock"
              :key="stockItem._id"
            >
              <v-list-item-content>
                <v-list-item-title>{{
                  stockItem.branchOffice.name
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span>{{ stockItem.existences }} existencias</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip left>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      v-on="on"
                      v-bind="attrs"
                      small
                      icon
                      @click="openExistencesDialog(stockItem)"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Cambiar existencias</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <span v-else>Sin stock en ninguna sucursal</span>
        </div>
      </v-card-text>
    </v-card>

    <product-modification
      v-if="showModificationDialog"
      :show="showModificationDialog"
      :currentProduct="productLocal"
      @cancel="showModificationDialog = false"
      @productSaved="productSaved"
    ></product-modification>

    <stock-adder
      v-if="showStockDialog"
      :show="showStockDialog"
      :product="productLocal"
      @cancel="showStockDialog = false"
      @productSaved="productSaved"
    ></stock-adder>

    <existences-changer
      v-if="showExistencesDialog"
      :show="showExistencesDialog"
      :productId="productLocal._id"
      :stockItem="stockItemSelected"
      @cancel="closeExistencesDialog()"
    ></existences-changer>
  </div>
</template>

<script>
import { currencyFormat } from "@/helpers/numbers.helper";

import productMenu from "./productMenu.vue";

export default {
  props: {
    product: { type: Object, required: true },
  },

  components: {
    "product-menu": productMenu,
    "product-modification": () => import("./productCreation.vue"),
    "stock-adder": () => import("./productStockAdder.vue"),
    "existences-changer": () => import("./productBOStockChanger.vue"),
  },

  data() {
    return {
      showStock: false,
      showModificationDialog: false,
      showStockDialog: false,
      showExistencesDialog: false,
      productLocal: this.product,
      stockItemSelected: null,
    };
  },

  watch: {
    product(v) {
      this.productLocal = v;
    },
  },

  computed: {
    totalStock() {
      let result = 0;

      this.product.stock.forEach((e) => {
        result = result + Number(e.existences);
      });

      return result;
    },
  },

  methods: {
    currencyFormat,

    productSaved(product) {
      this.productLocal = product;
      this.showModificationDialog = false;
      this.showStockDialog = false;
    },

    openExistencesDialog(stockItem) {
      this.stockItemSelected = stockItem;
      this.showExistencesDialog = true;
    },

    closeExistencesDialog() {
      this.showExistencesDialog = false;
      this.stockItemSelected = null;
    },
  },
};
</script>
