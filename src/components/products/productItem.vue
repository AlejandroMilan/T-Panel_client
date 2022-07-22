<template>
  <div>
    <v-card outlined tile>
      <v-card-title>
        <span class="secondary--text">{{ product.name }}</span>
      </v-card-title>
      <v-card-subtitle>
        <v-chip label>{{ currencyFormat(product.unitCost) }}</v-chip>
        <v-chip label class="ml-2">{{ totalStock }} piezas totales</v-chip>
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
          <v-list v-if="product.stock.length">
            <v-list-item
              v-for="stockItem in product.stock"
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
            </v-list-item>
          </v-list>
          <span v-else>Sin stock en ninguna sucursal</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { currencyFormat } from "@/helpers/numbers.helper";

export default {
  props: {
    product: { type: Object, required: true },
  },

  data: () => ({
    showStock: false,
  }),

  computed: {
    totalStock() {
      let result = 0;

      this.product.stock.forEach((e) => {
        result = result + e.existences;
      });

      return result;
    },
  },

  methods: {
    currencyFormat,
  },
};
</script>
