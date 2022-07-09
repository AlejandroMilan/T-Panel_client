<template>
  <div>
    <v-card tile flat>
      <v-card-title>
        <span>{{
          `${repairData.device.trademark} ${repairData.device.model}`
        }}</span>
        <v-spacer></v-spacer>
        <v-chip :color="getStatusColor(repairData.status.key)" label dark>{{
          repairData.status.title
        }}</v-chip>
      </v-card-title>
      <v-card-subtitle class="mt-1">
        <span>Recibido: {{ getDateString(repairData.admissionDate) }}</span>
        <v-spacer></v-spacer>
        <span v-if="repairData.deliveryDate"
          >Entregado: {{ getDateString(repairData.deliveryDate) }}</span
        >
        <v-spacer> </v-spacer>
        <span>{{ `Folio: ${repairData.invoiceId}` }}</span>
        <v-spacer> </v-spacer>
        <span>{{
          `Agregada por: ${
            repairData.createdBy
              ? repairData.createdBy.name
              : "Usuario eliminado"
          }`
        }}</span>
        <v-spacer> </v-spacer>
        <span>{{ `Sucursal: ${repairData.branchOffice.name}` }}</span>
        <div v-if="isRole(0) || isRole(1)">
          <v-chip :color="gainColor" small label
            >Ganancia: {{ currencyFormat(repairData.gain) }}</v-chip
          >
        </div>
      </v-card-subtitle>
      <v-card-text>
        <deviceSection :deviceData="getDeviceData()"></deviceSection>
        <customerSection :customerData="repairData.customer"></customerSection>
        <paymentSection
          v-if="repairData.payment"
          :paymentData="repairData.payment"
        ></paymentSection>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFullDateWithHour } from "@/helpers/date.helper";
import { currencyFormat } from "@/helpers/numbers.helper";

import deviceSection from "./deviceSection";
import customerSection from "./customerSection";
import paymentSection from "./paymentSection";

export default {
  name: "deviceData",

  components: { deviceSection, customerSection, paymentSection },

  props: {
    repairData: { type: Object, required: true },
  },

  computed: {
    ...mapGetters(["isRole"]),

    gainColor() {
      if (!this.repairData.gain) return null;
      if (this.repairData.gain > 0) return "success";
      else return "error";
    },
  },
  methods: {
    currencyFormat,

    getDateString(ISODate) {
      return getFullDateWithHour(ISODate);
    },

    getStatusColor(statusKey) {
      let color = "red darken-4";
      switch (statusKey) {
        case 400:
          color = "indigo";
          break;
        case 310:
          color = "#1976d2";
          break;
        case 300:
          color = "green darken-3";
          break;
        case 200:
          color = "amber darken-4";
          break;
        case 100:
          color = "red darken-4";
          break;
      }
      return color;
    },

    getDeviceData() {
      const {
        trademark,
        model,
        color,
        reasonForAdmission,
        blocking,
        canStart,
        presentsMoisture,
        beforeRepaired,
        imei,
        state,
      } = this.repairData.device;

      return {
        trademark,
        model,
        color,
        reasonForAdmission,
        blocking,
        canStart,
        presentsMoisture,
        beforeRepaired,
        imei,
        state,
      };
    },
  },
};
</script>
