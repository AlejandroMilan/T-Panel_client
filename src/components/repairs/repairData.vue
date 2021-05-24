<template>
  <div>
    <v-card outlined>
      <v-card-title>
        <span>{{
          `${repairData.device.trademark} ${repairData.device.model}`
        }}</span>
        <v-spacer></v-spacer>
        <v-chip :color="getStatusColor(repairData.status.key)" dark>{{
          repairData.status.title
        }}</v-chip>
      </v-card-title>
      <v-card-subtitle class="mt-1">
        <span
          >Recibido el {{ getDateString(repairData.admissionDate) }}
          {{
            repairData.deliveryDate
              ? `y entregado el ${getDateString(repairData.deliveryDate)}`
              : null
          }}</span
        >
        <v-spacer> </v-spacer>
        <span>{{ `Folio: ${repairData.invoiceId}` }}</span>
      </v-card-subtitle>
      <v-card-text>
        <deviceSection :deviceData="getDeviceData()"></deviceSection>
        <customerSection :customerData="repairData.customer"></customerSection>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getFullDate } from "@/helpers/date.helper";
import deviceSection from "./deviceSection";
import customerSection from "./customerSection";

export default {
  name: "deviceData",

  components: { deviceSection, customerSection },

  props: {
    repairData: { type: Object, required: true },
  },

  methods: {
    getDateString(ISODate) {
      return getFullDate(ISODate);
    },

    getStatusColor(statusKey) {
      let color = "red darken-4";
      switch (statusKey) {
        case 400:
          color = "indigo";
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
      };
    },
  },
};
</script>
