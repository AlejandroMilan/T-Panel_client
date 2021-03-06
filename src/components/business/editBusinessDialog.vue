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
        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
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
                color="secondary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="timezone"
                :items="validTimezones"
                outlined
                dense
                color="secondary"
                :item-text="`${timezone} (HH:MM)`"
                label="Zona horaria"
                hint="La zona horaria está definida por tu país, y zona en la mayoría de casos."
                persistent-hint
                :disabled="loading"
                :error-messages="errors.timezone"
                @input="validateField('timezone')"
                @blur="validateField('timezone')"
              ></v-autocomplete>
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
                color="secondary"
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
        <v-btn color="secondary" outlined @click="$emit('cancel')">
          <v-icon small class="mr-2">mdi-close</v-icon>
          <span>Cancelar</span></v-btn
        >
        <v-btn
          color="primary"
          dark
          :disabled="!isFormValid || loading"
          :loading="loading"
          @click="submit"
        >
          <v-icon small class="mr-2">mdi-content-save</v-icon>
          <span>Guardar</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { _ } from "vue-underscore";
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
import { DateTime } from "luxon";
import { zones } from "tzdata";

export default {
  name: "editBusinessDialog",

  props: {
    show: { type: Boolean, default: false },
    business: { type: Object, default: null },
  },

  mixins: [validationMixin, serverRequestMixin],

  computed: {
    ...mapGetters(["user"]),
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
      if (this.errors.timezone.length) return false;
      return true;
    },
    validTimezones() {
      const luxonValidTimezones = Object.entries(zones)
        .filter(([, v]) => Array.isArray(v))
        .map(([zoneName]) => zoneName)
        .filter((tz) => DateTime.local().setZone(tz).isValid);
      return luxonValidTimezones;
    },
  },

  data: () => ({
    loading: false,
    error: null,
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
    timezone: "",
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
      timezone: [],
    },
  }),

  validations: {
    name: { required, minLength: minLength(3) },
    email: { required, email },
    phoneNumber: {
      required,
      numeric,
      minLength: minLength(6),
      maxLength: maxLength(10),
    },
    website: { url },
    street: { required },
    extNumber: { required },
    county: { required },
    city: { required },
    state: { required },
    country: { required },
    timezone: { required },
  },

  mounted() {
    if (this.business) this.setData();
  },

  methods: {
    ...mapActions(["editUser"]),

    setData() {
      const keys = _.keys(this.business);
      const adressKeys = _.keys(this.business?.adress);
      keys.forEach((key) => {
        this[key] = this.business[key];
      });
      adressKeys.forEach((key) => {
        this[key] = this.business.adress[key];
      });
    },

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
        errors.push("El número telefónico debe tener entre 6 y 10 dígitos");
      !this.$v.phoneNumber.maxLength &&
        errors.push("El número telefónico debe tener entre 6 y 10 dígitos");
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
      this.error = null;
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
      this.validateField("timezone");

      if (this.isFormValid) {
        this.loading = true;
        try {
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
            timezone: this.timezone,
          };
          if (this.website) sendData.website = this.website;
          if (this.intNumber) sendData.adress.intNumber = this.intNumber;

          const response = this.business
            ? await this.putRequest(
                `/business/${this.user.businessId}`,
                sendData
              )
            : await this.postRequest("/business/", sendData);

          this.loading = false;

          if (!this.business)
            this.editUser({
              ...this.user,
              businessId: response.businessCreated._id,
            });

          const emitData = this.business
            ? response.businessUpdated
            : response.businessCreated;

          this.$emit("businessUpdated", emitData);
        } catch (error) {
          this.loading = false;
          error.status < 500
            ? (this.error = error.data.message)
            : console.error(error);
        }
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
