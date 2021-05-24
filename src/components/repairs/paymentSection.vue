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
              paymentData.estimatedCost
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6" v-if="paymentData.prePayment">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Adelanto del cliente</v-list-item-subtitle>
            <v-list-item-title>{{ paymentData.prePayment }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col
        cols="12"
        v-if="paymentData.prePayment < paymentData.estimatedCost"
      >
        <v-alert dense type="warning" text
          >Al cliente aún le resta por pagar
          {{ paymentData.estimatedCost - paymentData.prePayment }}</v-alert
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "paymentSection",

  props: {
    paymentData: { type: Object, required: true },
  },
};
</script>
