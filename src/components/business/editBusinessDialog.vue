<template>
  <v-dialog
    persistent
    v-model="show"
    :fullscreen="!$vuetify.breakpoint.mdAndUp"
    :width="$vuetify.breakpoint.mdAndUp ? '600' : null"
  >
    <v-card>
      <v-card-title> Editar datos del negocio </v-card-title>
      <v-card-text>
        <v-form>
          <div class="d-flex">
            <v-icon small class="mr-2">mdi-information</v-icon>
            <v-subheader>Datos generales</v-subheader>
          </div>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Nombre del negocio"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex">
            <v-icon small class="mr-2">mdi-message</v-icon>
            <v-subheader>Datos de contacto</v-subheader>
          </div>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.email"
                @input="validateEmail()"
                @blur="validateEmail()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="phoneNumber"
                label="Número telefónico"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.phoneNumber"
                @input="validatePhoneNumber()"
                @blur="validatePhoneNumber()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="website"
                label="Sitio web (opcional)"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.website"
                @input="validateWebsite()"
                @blur="validateWebsite()"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex">
            <v-icon small class="mr-2">mdi-map</v-icon>
            <v-subheader>Datos de domicilio</v-subheader>
          </div>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="street"
                label="Calle"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.street"
                @input="validateField('street')"
                @blur="validateField('street')"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="extNumber"
                label="Núm. Exterior"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.extNumber"
                @input="validateField('extNumber')"
                @blur="validateField('extNumber')"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="intNumber"
                label="Núm. Interior (opcional)"
                outlined
                dense
                color="primary"
                :disabled="loading"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="county"
                label="Colonia"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.county"
                @input="validateField('county')"
                @blur="validateField('county')"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="city"
                label="Ciudad"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.city"
                @input="validateField('city')"
                @blur="validateField('city')"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="state"
                label="Estado"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.state"
                @input="validateField('state')"
                @blur="validateField('state')"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="country"
                label="País"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.country"
                @input="validateField('country')"
                @blur="validateField('country')"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" outlined @click="$emit('cancel')"
          >Cancelar</v-btn
        >
        <v-btn
          color="primary"
          :disabled="!isFormValid || loading"
          @click="submit"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import {
  required,
  email,
  minLength,
  maxLength,
  numeric,
  url,
} from "vuelidate/lib/validators";

export default {
  name: "editBusinessDialog",

  props: {
    show: { type: Boolean, default: false },
    business: { type: Object, default: null },
  },

  mixins: [validationMixin, serverRequestMixin],

  computed: {
    isFormValid() {
      if (this.errors.name.length) return false;
      if (this.errors.email.length) return false;
      if (this.errors.phoneNumber.length) return false;
      if (this.errors.website.length) return false;
      if (this.errors.street.length) return false;
      if (this.errors.extNumber.length) return false;
      if (this.errors.county.length) return false;
      if (this.errors.city.length) return false;
      if (this.errors.state.length) return false;
      if (this.errors.country.length) return false;
      return true;
    },
  },

  data: () => ({
    loading: false,
    name: "",
    email: "",
    phoneNumber: "",
    website: "",
    street: "",
    extNumber: "",
    intNumber: "",
    county: "",
    city: "",
    state: "",
    country: "",
    errors: {
      name: [],
      email: [],
      phoneNumber: [],
      website: [],
      street: [],
      extNumber: [],
      county: [],
      city: [],
      state: [],
      country: [],
    },
  }),

  validations: {
    name: { required, minLength: minLength(3) },
    email: { required, email },
    phoneNumber: {
      required,
      numeric,
      minLength: minLength(10),
      maxLength: maxLength(10),
    },
    website: { url },
    street: { required },
    extNumber: { required },
    county: { required },
    city: { required },
    state: { required },
    country: { required },
  },

  methods: {
    validateName() {
      const errors = [];
      this.$v.name.$touch();
      !this.$v.name.required && errors.push("El nombre es requerido");
      !this.$v.name.minLength &&
        errors.push("El nombre debe tener al menos 3 caracteres");
      this.errors.name = errors;
    },
    validateEmail() {
      const errors = [];
      this.$v.email.$touch();
      !this.$v.email.required &&
        errors.push("El correo electrónico es requerido");
      !this.$v.email.email && errors.push("Correo electrónico no válido");
      this.errors.email = errors;
    },
    validatePhoneNumber() {
      const errors = [];
      this.$v.phoneNumber.$touch();
      !this.$v.phoneNumber.required &&
        errors.push("El número telefónico es requerido");
      !this.$v.phoneNumber.numeric &&
        errors.push("Número telefónico no válido");
      !this.$v.phoneNumber.minLength &&
        errors.push("El número telefónico debe tener 10 dígitos");
      !this.$v.phoneNumber.maxLength &&
        errors.push("El número telefónico debe tener 10 dígitos");
      this.errors.phoneNumber = errors;
    },
    validateWebsite() {
      const errors = [];
      this.$v.website.$touch();
      !this.$v.website.url &&
        errors.push(
          "Sitio web no válido, ejemplo de stio válido: https://misitio.com"
        );
      this.errors.website = errors;
    },
    validateField(fieldName) {
      const errors = [];
      this.$v[fieldName].$touch();
      !this.$v[fieldName].required && errors.push("Campo requerido");
      this.errors[fieldName] = errors;
    },

    async submit() {
      this.validateName();
      this.validateEmail();
      this.validateWebsite();
      this.validatePhoneNumber();
      this.validateField("street");
      this.validateField("extNumber");
      this.validateField("county");
      this.validateField("city");
      this.validateField("state");
      this.validateField("country");

      if (this.isFormValid) {
        let sendData = {
          name: this.name,
          email: this.email,
          phoneNumber: this.phoneNumber,
          adress: {
            street: this.street,
            extNumber: this.extNumber,
            county: this.county,
            city: this.city,
            state: this.state,
            country: this.country,
          },
        };
        if (this.website) sendData.website = this.website;
        if (this.intNumber) sendData.adress.intNumber = this.intNumber;

        const response = await this.postRequest("/business/", sendData);
        console.log(response);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-subheader {
  padding: 0;
}
</style>
