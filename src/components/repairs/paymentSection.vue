<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-subheader>Pago</v-subheader>
      </v-col>
      <v-col cols="12" md="6" v-if="paymentData.estimatedCost">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle
              >Costo estimado de la reparación</v-list-item-subtitle
            >
            <v-list-item-title>{{
              toCurrency(paymentData.estimatedCost)
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6" v-if="paymentData.prePayment">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Adelanto del cliente</v-list-item-subtitle>
            <v-list-item-title>{{
              toCurrency(paymentData.prePayment)
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { currencyFormat } from "@/helpers/numbers.helper";

export default {
  name: "paymentSection",

  props: {
    paymentData: { type: Object, required: true },
  },

  methods: {
    toCurrency(number) {
      return currencyFormat(number);
    },
  },
};
</script>
