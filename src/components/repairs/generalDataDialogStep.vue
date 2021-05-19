<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="10" md="11">
        <v-text-field
          v-model="invoiceId"
          label="Número de folio"
          outlined
          dense
          color="primary"
          :error-messages="errors.invoiceId"
          @input="validateInvoiceId()"
          @blur="validateInvoiceId()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2" md="1">
        <div class="d-flex justify-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon color="primary" v-bind="attrs" v-on="on"
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
          <v-btn color="primary" :disabled="!isFormValid"
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

export default {
  name: "generalDataDialogStep",

  mixins: [validationMixin],

  computed: {
    isFormValid() {
      if (this.errors.invoiceId.length) return false;
      if (this.errors.estimatedCost.length) return false;
      if (this.errors.prePayment.length) return false;
      return true;
    },
  },

  data: () => ({
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
  },
};
</script>
