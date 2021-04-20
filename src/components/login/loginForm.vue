<template>
  <div>
    <v-form>
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            outlined
            dense
            color="primary"
            :error-messages="errors.email"
            :disabled="loading"
            @input="validateEmail()"
            @blur="validateEmail()"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            outlined
            dense
            label="Contraseña"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :error-messages="errors.password"
            :disabled="loading"
            @input="validatePassword()"
            @blur="validatePassword()"
          ></v-text-field>
          <forgottenPassword />
        </v-col>
        <v-col cols="12" class="mt-5">
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            @click="submit"
            :loading="loading"
            >Iniciar sesión</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

import forgottenPassword from "./forgottenPassword";

import loginAction from "./login.service";

export default {
  name: "loginForm",

  mixins: [validationMixin],

  components: {
    forgottenPassword,
  },

  computed: {
    ...mapGetters(["httpUrl"]),
    isFormValid() {
      if (this.errors.email.length) return false;
      if (this.errors.password.length) return false;
      return true;
    },
  },

  data: () => ({
    showPassword: false,
    loading: false,
    email: "",
    password: "",
    errors: {
      email: [],
      password: [],
    },
  }),

  validations: {
    email: { required, email },
    password: { required },
  },

  methods: {
    validateEmail() {
      const errors = [];
      this.$v.email.$touch();
      !this.$v.email.required &&
        errors.push("El correo electrónico es requerido");
      !this.$v.email.email && errors.push("Correo electrónico no válido");
      this.errors.email = errors;
    },

    validatePassword() {
      const errors = [];
      this.$v.password.$touch();
      !this.$v.password.required && errors.push("La contraseña es requerida");
      this.errors.password = errors;
    },

    async submit() {
      this.validateEmail();
      this.validatePassword();
      if (this.isFormValid) {
        this.loading = true;
        try {
          const user = {
            email: this.email,
            password: this.password,
          };
          const response = await loginAction(this.httpUrl, user);
          console.log(response);
          this.loading = false;
        } catch (error) {
          this.loading = false;
          console.error(error.response.data);
        }
      }
    },
  },
};
</script>
