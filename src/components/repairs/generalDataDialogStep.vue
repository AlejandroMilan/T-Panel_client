<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="12" v-if="getterError" class="my-5">
        <v-alert type="error" dense outlined>{{ getterError }}</v-alert>
      </v-col>
      <v-col cols="10" md="11">
        <v-text-field
          v-model="invoiceId"
          label="Número de folio"
          outlined
          dense
          color="primary"
          :error-messages="errors.invoiceId"
          :disabled="loading"
          @input="validateInvoiceId()"
          @blur="validateInvoiceId()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2" md="1">
        <div class="d-flex justify-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-bind="attrs"
                v-on="on"
                :loading="loading"
                @click="getInvoiceId"
                ><v-icon>mdi-autorenew</v-icon></v-btn
              >
            </template>
            <span>Generar folio automáticamente</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="payment.estimatedCost"
          label="Costo estimado (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.estimatedCost"
          :disabled="loading"
          @input="validateEstimatedCost()"
          @blur="validateEstimatedCost()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="payment.prePayment"
          label="Adelanto del cliente (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.prePayment"
          :disabled="loading"
          @input="validatePrepayment()"
          @blur="validatePrepayment()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <div class="d-flex">
          <v-btn
            color="secondary"
            outlined
            @click="$emit('cancel')"
            class="mr-2"
            >Paso anterior</v-btn
          >
          <v-btn
            color="primary"
            :disabled="!isFormValid || loading"
            @click="validateStep"
            >Guardar reparación</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, numeric } from "vuelidate/lib/validators";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "generalDataDialogStep",

  mixins: [validationMixin, serverRequestMixin],

  computed: {
    isFormValid() {
      if (this.errors.invoiceId.length) return false;
      if (this.errors.estimatedCost.length) return false;
      if (this.errors.prePayment.length) return false;
      return true;
    },
  },

  data: () => ({
    loading: false,
    getterError: null,
    invoiceId: "",
    payment: {
      estimatedCost: "",
      prePayment: "",
    },
    errors: {
      invoiceId: [],
      estimatedCost: [],
      prePayment: [],
    },
  }),

  validations: {
    invoiceId: { required },
    payment: {
      estimatedCost: { numeric },
      prePayment: { numeric },
    },
  },

  methods: {
    validateInvoiceId() {
      const errors = [];
      this.$v.invoiceId.$touch();
      !this.$v.invoiceId.required &&
        errors.push("El número de folio es requerido");
      this.errors.invoiceId = errors;
    },

    validateEstimatedCost() {
      const errors = [];
      this.$v.payment.estimatedCost.$touch();
      !this.$v.payment.estimatedCost.numeric &&
        errors.push("Ingresa una cantidad válida");
      this.errors.estimatedCost = errors;
    },

    validatePrepayment() {
      const errors = [];
      this.$v.payment.prePayment.$touch();
      !this.$v.payment.prePayment.numeric &&
        errors.push("Ingresa una cantidad válida");
      this.errors.prePayment = errors;
    },

    async getInvoiceId() {
      this.loading = true;
      try {
        const response = await this.getRequest("/repairs/generateInvoiceId");
        this.loading = false;
        this.invoiceId = response.invoiceId;
        this.errors.invoiceId = [];
      } catch (error) {
        this.loading = false;
        this.getterError = error.response.data.message;
        if (error.response.status >= 500) console.error(error.response);
      }
    },

    validateStep() {
      this.validateInvoiceId();
      this.validateEstimatedCost();
      this.validatePrepayment();
      if (!this.isFormValid) return;

      const emitData = {
        invoiceId: this.invoiceId,
        payment: {
          estimatedCost: this.payment.estimatedCost,
          prePayment: this.payment.prePayment,
        },
      };

      this.$emit("stepValid", emitData);
    },
  },
};
</script>
