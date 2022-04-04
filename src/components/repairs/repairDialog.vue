<template>
  <div>
    <v-dialog
      persistent
      v-model="show"
      :fullscreen="!$vuetify.breakpoint.mdAndUp"
      :width="$vuetify.breakpoint.mdAndUp ? '850' : null"
    >
      <v-card :loading="loading">
        <v-card-title
          >{{ repair ? "Editar reparación" : "Agregar reparación" }}
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('cancel')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-alert v-if="submitError" type="error" dense outlined>{{
            submitError
          }}</v-alert>
          <v-stepper v-model="formStep" vertical class="elevation-0">
            <v-stepper-step step="1" color="accent" :complete="formStep > 1"
              >Datos del dispositivo</v-stepper-step
            >
            <v-stepper-content step="1">
              <deviceDialogStep
                @cancel="$emit('cancel')"
                @stepValid="deviceStepValid"
                :currentDevice="repair ? device : null"
              ></deviceDialogStep>
            </v-stepper-content>
            <v-stepper-step step="2" color="accent" :complete="formStep > 2"
              >Datos del cliente</v-stepper-step
            >
            <v-stepper-content step="2">
              <customerDialogStep
                :currentCustomer="repair ? customer : null"
                @cancel="formStep = 1"
                @stepValid="customerStepValid"
              ></customerDialogStep>
            </v-stepper-content>
            <v-stepper-step step="3" color="accent">
              Otros datos
              <small>Folio del servicio, costos</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <generalDataDialogStep
                :currentData="repair ? getGeneralData() : null"
                :isLoading="loading"
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
    branchOffice: "",
  }),

  mounted() {
    if (this.repair) {
      this.device = this.repair.device;
      this.customer = this.repair.customer;
      this.payment = this.repair.payment;
      this.invoiceId = this.repair.invoiceId;
      this.branchOffice = this.repair.branchOffice;
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
      this.branchOffice = generalData.branchOffice;
      this.submit();
    },

    async submit() {
      this.submitError = null;
      this.loading = true;
      try {
        const submitData = this.repair
          ? {
              device: this.device,
              customer: this.customer,
              invoiceId: this.invoiceId,
              branchOffice: this.branchOffice,
            }
          : {
              device: this.device,
              customer: this.customer,
              invoiceId: this.invoiceId,
              status: 100,
              branchOffice: this.branchOffice,
            };
        submitData.payment = {};
        if (this.payment.estimatedCost)
          submitData.payment.estimatedCost = this.payment.estimatedCost;
        if (this.payment.prePayment)
          submitData.payment.prePayment = this.payment.prePayment;

        const response = this.repair
          ? await this.putRequest(
              `/repairs/${this.repair.invoiceId}`,
              submitData
            )
          : await this.postRequest("/repairs", submitData);
        this.loading = false;

        this.$emit("repairSaved", response.repair);
      } catch (error) {
        this.loading = false;
        this.submitError = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    getGeneralData() {
      let data = {
        invoiceId: this.invoiceId,
        branchOffice: this.branchOffice._id,
      };
      if (this.payment) {
        data.payment = {};
        if (this.payment.estimatedCost)
          data.payment.estimatedCost = this.payment.estimatedCost;
        if (this.payment.prePayment)
          data.payment.prePayment = this.payment.prePayment;
      }
      return data;
    },
  },
};
</script>
