<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="12" md="6">
        <v-text-field
          v-model="name"
          label="Nombre del cliente"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="phoneNumber"
          label="Número telefónico (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.phoneNumber"
          @input="validatePhoneNumber()"
          @blur="validatePhoneNumber()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          label="Correo electrónico (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.email"
          @input="validateEmail()"
          @blur="validateEmail()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="adress"
          label="Dirección (opcional)"
          outlined
          dense
          color="primary"
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
          >
            <v-icon small>mdi-arrow-left</v-icon>
            {{ $vuetify.breakpoint.mdAndUp ? "Paso anterior" : null }}</v-btn
          >
          <v-btn color="primary" :disabled="!isFormValid" @click="validateStep"
            >{{ $vuetify.breakpoint.mdAndUp ? "Siguiente" : null }}
            <v-icon small>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";
import { _ } from "vue-underscore";

export default {
  name: "customerDialogStep",

  props: {
    currentCustomer: { type: Object, default: null },
  },

  mixins: [validationMixin],

  computed: {
    isFormValid() {
      if (this.errors.name.length) return false;
      if (this.errors.phoneNumber.length) return false;
      if (this.errors.email.length) return false;
      return true;
    },
  },

  watch: {
    currentCustomer() {
      this.setCurrentCustumer();
    },
  },

  data: () => ({
    name: "",
    phoneNumber: "",
    email: "",
    adress: "",
    errors: {
      name: [],
      phoneNumber: [],
      email: [],
    },
  }),

  validations: {
    name: { required },
    phoneNumber: {
      numeric,
      minLength: minLength(6),
      maxLength: maxLength(10),
    },
    email: { email },
  },

  mounted() {
    if (this.currentCustomer) {
      this.setCurrentCustumer();
    }
  },

  methods: {
    validateName() {
      const errors = [];
      this.$v.name.$touch();
      !this.$v.name.required && errors.push("El nombre es requerido");
      this.errors.name = errors;
    },

    validatePhoneNumber() {
      const errors = [];
      this.$v.phoneNumber.$touch();
      !this.$v.phoneNumber.numeric &&
        errors.push("Número telefónico no válido");
      !this.$v.phoneNumber.minLength &&
        errors.push("El número telefónico debe tener entre 6 y 10 dígitos");
      !this.$v.phoneNumber.maxLength &&
        errors.push("El número telefónico debe tener entre 6 y 10 dígitos");
      this.errors.phoneNumber = errors;
    },

    validateEmail() {
      const errors = [];
      this.$v.email.$touch();
      !this.$v.email.email && errors.push("Correo electrónico no válido");
      this.errors.email = errors;
    },

    validateStep() {
      this.validateName();
      this.validatePhoneNumber();
      this.validateEmail();
      if (!this.isFormValid) return;

      const emitData = {
        name: this.name,
      };
      if (this.phoneNumber) emitData.phoneNumber = this.phoneNumber;
      if (this.email) emitData.email = this.email;
      if (this.adress) emitData.adress = this.adress;

      this.$emit("stepValid", emitData);
    },

    setCurrentCustumer() {
      if (this.currentCustomer) {
        const keys = _.keys(this.currentCustomer);
        keys.forEach((key) => {
          if (
            this[key] ||
            this[key] === null ||
            this[key] === "" ||
            this[key] === false
          )
            this[key] = this.currentCustomer[key];
        });
      }
    },
  },
};
</script>
