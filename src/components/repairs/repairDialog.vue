<template>
  <div>
    <v-dialog
      persistent
      v-model="show"
      :fullscreen="!$vuetify.breakpoint.mdAndUp"
      :width="$vuetify.breakpoint.mdAndUp ? '750' : null"
    >
      <v-card :loading="loading">
        <v-card-title>{{
          repair ? "Editar reparación" : "Agregar reparación"
        }}</v-card-title>
        <v-card-text>
          <v-alert v-if="submitError" type="error" dense outlined>{{
            submitError
          }}</v-alert>
          <v-stepper v-model="formStep" vertical class="elevation-0">
            <v-stepper-step step="1" :complete="formStep > 1"
              >Datos del dispositivo</v-stepper-step
            >
            <v-stepper-content step="1">
              <deviceDialogStep
                @cancel="$emit('cancel')"
                @stepValid="deviceStepValid"
                :currentDevice="repair ? device : null"
              ></deviceDialogStep>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="formStep > 2"
              >Datos del cliente</v-stepper-step
            >
            <v-stepper-content step="2">
              <customerDialogStep
                :currentCustomer="repair ? customer : null"
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

import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "repairDialog",

  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, defualt: false },
    repair: { type: Object, defualt: null },
  },

  components: { deviceDialogStep, customerDialogStep, generalDataDialogStep },

  data: () => ({
    formStep: 1,
    loading: false,
    submitError: null,
    device: {},
    customer: {},
    payment: {},
    invoiceId: "",
  }),

  mounted() {
    if (this.repair) {
      this.device = this.repair.device;
      this.customer = this.repair.customer;
      this.payment = this.repair.payment;
      this.invoiceId = this.repair.invoiceId;
    }
  },

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

    async submit() {
      this.loading = true;
      try {
        const submitData = {
          device: this.device,
          customer: this.customer,
          invoiceId: this.invoiceId,
          status: 100,
        };
        if (this.payment.estimatedCost || this.payment.prePayment) {
          submitData.payment = {};
          if (this.payment.estimatedCost)
            submitData.payment.estimatedCost = this.payment.estimatedCost;
          if (this.payment.prePayment)
            submitData.payment.prePayment = this.payment.prePayment;
        }

        const response = await this.postRequest("/repairs", submitData);
        this.loading = false;

        this.$emit("repairSaved", response.repair);
      } catch (error) {
        this.loading = false;
        this.submitError = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },
  },
};
</script>
