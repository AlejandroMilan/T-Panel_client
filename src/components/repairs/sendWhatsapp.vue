<template>
  <v-dialog persistent width="600" v-model="show">
    <v-card>
      <v-card-title>Enviar WhatsApp al cliente</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="countryCode"
              :items="countries"
              item-text="name"
              item-value="dial_code"
              :error-messages="errors.countryCode"
              label="País"
              outlined
              dense
              color="secondary"
              @input="validateCountryCode()"
              @blur="validateCountryCode()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="phoneNumber"
              dense
              outlined
              label="Número telefónico"
              color="secondary"
              :error-messages="errors.phoneNumber"
              @input="validatePhoneNumber()"
              @blur="validatePhoneNumber()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              rows="4"
              v-model="message"
              filled
              color="secondary"
              label="Mensaje"
              :error-messages="errors.message"
              @input="validateMessage()"
              @blur="validateMessage()"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" outlined @click="$emit('cancel')">
          <v-icon small class="mr-2">mdi-close</v-icon>
          <span>Cancelar</span>
        </v-btn>
        <v-btn color="primary" :disabled="!isFormValid" @click="submit">
          <v-icon small class="mr-2" color="secondary">mdi-send</v-icon>
          <span class="secondary--text">Enviar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";

const jsonFile = require("./CountryCodes.json");

export default {
  name: "sendWhatsapp",

  mixins: [validationMixin],

  props: {
    show: { type: Boolean, default: false },
    currentNumber: { type: String || Number, default: "" },
  },

  computed: {
    countryCode: {
      get() {
        return this.$store.getters.countryCode;
      },
      set(v) {
        return this.$store.commit("setCountryCode", v);
      },
    },

    messageFormatted() {
      return this.message
        .replaceAll(" ", "%20")
        .replaceAll(/(?:\r\n|\r|\n)/g, "%0a");
    },

    isFormValid() {
      if (this.errors.phoneNumber.length) return false;
      if (this.errors.message.length) return false;
      if (this.errors.countryCode.length) return false;
      return true;
    },
  },

  watch: {
    currentNumber() {
      this.phoneNumber = this.currentNumber;
    },
  },

  data: () => ({
    phoneNumber: "",
    message: "",
    countries: [],
    errors: {
      phoneNumber: [],
      message: [],
      countryCode: [],
    },
  }),

  validations: {
    phoneNumber: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(10),
      numeric,
    },
    message: { required },
    countryCode: { required },
  },

  mounted() {
    this.phoneNumber = this.currentNumber;
    this.getCountries();
  },

  methods: {
    validatePhoneNumber() {
      const errors = [];
      this.$v.phoneNumber.$touch();
      !this.$v.phoneNumber.required &&
        errors.push("El número telefónico es requerido");
      !this.$v.phoneNumber.numeric &&
        errors.push("Número telefónico no válido");
      !this.$v.phoneNumber.minLength &&
        errors.push("El número telefónico debe tener entre 6 y 10 dígitos");
      !this.$v.phoneNumber.maxLength &&
        errors.push("El número telefónico debe tener entre 6 10 dígitos");
      this.errors.phoneNumber = errors;
    },

    validateMessage() {
      const errors = [];
      this.$v.message.$touch();
      !this.$v.message.required && errors.push("El mensaje es requerido");
      this.errors.message = errors;
    },

    validateCountryCode() {
      const errors = [];
      this.$v.countryCode.$touch();
      !this.$v.countryCode.required &&
        errors.push("El código del país es requerido");
      this.errors.countryCode = errors;
    },

    submit() {
      this.validatePhoneNumber();
      this.validateMessage();
      this.validateCountryCode();
      if (!this.isFormValid) return;

      const a = document.createElement("a");
      a.href = `https://wa.me/${this.countryCode.replaceAll("+", "")}${
        this.phoneNumber
      }?text=${this.messageFormatted}`;
      a.target = "_blank";
      a.click();
      a.remove();
    },

    getCountries() {
      this.countries = jsonFile;
    },
  },
};
</script>
