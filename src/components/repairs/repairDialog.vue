<template>
  <div>
    <v-dialog
      persistent
      v-model="show"
      :fullscreen="!$vuetify.breakpoint.mdAndUp"
      :width="$vuetify.breakpoint.mdAndUp ? '750' : null"
    >
      <v-card>
        <v-card-title>Agregar reparación</v-card-title>
        <v-card-text>
          <v-stepper v-model="formStep" vertical class="elevation-0">
            <v-stepper-step step="1" :complete="formStep > 1"
              >Datos del dispositivo</v-stepper-step
            >
            <v-stepper-content step="1">
              <deviceDialogStep
                @cancel="$emit('cancel')"
                @stepValid="deviceStepValid"
              ></deviceDialogStep>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="formStep > 2"
              >Datos del cliente</v-stepper-step
            >
            <v-stepper-content step="2">
              <customerDialogStep
                @cancel="formStep = 1"
                @stepValid="customerStepValid"
              ></customerDialogStep>
            </v-stepper-content>
            <v-stepper-step step="3">
              Otros datos
              <small>Folio del servicio, costos</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <generalDataDialogStep
                @cancel="formStep = 2"
                @stepValid="generalDataStepValid"
              ></generalDataDialogStep>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import deviceDialogStep from "./deviceDialogStep";
import customerDialogStep from "./customerDialogStep";
import generalDataDialogStep from "./generalDataDialogStep";

export default {
  name: "repairDialog",

  props: {
    show: { type: Boolean, defualt: false },
  },

  components: { deviceDialogStep, customerDialogStep, generalDataDialogStep },

  data: () => ({
    formStep: 1,
    device: {},
    customer: {},
    payment: {},
    invoiceId: "",
  }),

  methods: {
    deviceStepValid(deviceInfo) {
      this.device = deviceInfo;
      this.formStep = 2;
    },

    customerStepValid(customerInfo) {
      this.customer = customerInfo;
      this.formStep = 3;
    },

    generalDataStepValid(generalData) {
      this.payment = generalData.payment;
      this.invoiceId = generalData.invoiceId;
      this.submit();
    },

    submit() {
      const submitData = {
        device: this.device,
        customer: this.customer,
        invoiceId: this.invoiceId,
      };
      if (this.payment.estimatedCost || this.payment.prePayment) {
        submitData.payment = {};
        if (this.payment.estimatedCost)
          submitData.payment.estimatedCost = this.payment.estimatedCost;
        if (this.payment.prePayment)
          submitData.payment.prePayment = this.payment.prePayment;
      }

      console.log(submitData);
    },
  },
};
</script>
