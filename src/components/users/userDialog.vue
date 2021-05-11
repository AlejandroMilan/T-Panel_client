<template>
  <v-dialog width="600" v-model="show" persistent>
    <v-card>
      <v-card-title>Nuevo usuario</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="Nombre completo"
              outlined
              dense
              color="primary"
              :disabled="loading"
              :error-messages="errors.name"
              @input="validateName()"
              @blur="validateName()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
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
              v-model="firstPassword"
              label="Contraseña asignada"
              outlined
              type="password"
              dense
              color="primary"
              :disabled="loading"
              :error-messages="errors.firstPassword"
              @input="validateFirstPassword()"
              @blur="validateFirstPassword()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="secondPassword"
              label="Confirmar contraseña"
              outlined
              type="password"
              dense
              color="primary"
              :disabled="loading"
              :error-messages="errors.secondPassword"
              @input="validateSecondPassword()"
              @blur="validateSecondPassword()"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  name: "userDialog",

  mixins: [validationMixin],

  props: {
    show: { type: Boolean, required: true },
  },

  data: () => ({
    loading: false,
    name: "",
    email: "",
    firstPassword: "",
    secondPassword: "",
    errors: {
      name: [],
      email: [],
      firstPassword: [],
      secondPassword: [],
    },
    signupError: "",
  }),

  validations: {
    name: { required, email, minLength: minLength(5) },
    email: { required, email },
    firstPassword: { required, minLength: minLength(8) },
    secondPassword: { required },
  },

  methods: {
    validateName() {
      const errors = [];
      this.$v.name.$touch();
      !this.$v.name.required && errors.push("El nombre es requerido");
      !this.$v.name.minLength &&
        errors.push("El nombre debe tener al menos 5 caracteres");
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

    validateFirstPassword() {
      const errors = [];
      this.$v.firstPassword.$touch();
      !this.$v.firstPassword.required &&
        errors.push("La contraseña es requerida");
      !this.$v.firstPassword.minLength &&
        errors.push("La contraseña debe tener al menos 8 caracteres");
      this.errors.firstPassword = errors;
    },

    validateSecondPassword() {
      const errors = [];
      this.$v.secondPassword.$touch();
      !this.$v.secondPassword.required &&
        errors.push("La confirmación de contraseña es requerida");
      this.secondPassword !== this.firstPassword &&
        errors.push("Las contraseñas no coinciden");
      this.errors.secondPassword = errors;
    },
  },
};
</script>