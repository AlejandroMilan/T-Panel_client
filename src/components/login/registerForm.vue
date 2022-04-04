<template>
  <div>
    <v-form>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="name"
            label="Nombre completo"
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
        <v-col cols="12">
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
            v-model="firstPassword"
            label="Contraseña"
            outlined
            type="password"
            dense
            color="secondary"
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
            color="secondary"
            :disabled="loading"
            :error-messages="errors.secondPassword"
            @input="validateSecondPassword()"
            @blur="validateSecondPassword()"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="mt-2">
          <span
            >Al crear tu cuenta estás aceptando nuestra
            <a
              href="https://www.privacypolicies.com/live/6952b9f1-3a74-409a-b76c-5a9f0da22934"
              target="_blank"
              class="secondary--text"
              >política de privacidad.</a
            ></span
          >
        </v-col>
        <v-col cols="12">
          <v-btn
            color="secondary"
            outlined
            :disabled="loading"
            @click="$emit('cancel')"
            >Cancelar</v-btn
          >
          <v-btn
            color="primary"
            :disabled="!isFormValid || loading"
            :loading="loading"
            class="ml-2"
            @click="submit"
          >
            <span class="secondary--text">Crear cuenta</span>
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="signupError" class="my-5">
          <v-alert type="error" dense outlined>{{ signupError }}</v-alert>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  name: "registerForm",

  mixins: [validationMixin],

  computed: {
    ...mapGetters(["masterToken"]),

    isFormValid() {
      if (this.errors.name.length) return false;
      if (this.errors.email.length) return false;
      if (this.errors.firstPassword.length) return false;
      if (this.errors.secondPassword.length) return false;
      return true;
    },
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
    ...mapActions(["signUp"]),

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

    async submit() {
      this.signupError = "";
      this.validateName();
      this.validateEmail();
      this.validateFirstPassword();
      this.validateSecondPassword();
      if (this.isFormValid) {
        try {
          this.loading = true;
          const user = {
            name: this.name,
            email: this.email,
            password: this.firstPassword,
            role: 0,
          };

          await this.signUp({ user, token: this.masterToken });

          this.loading = false;
          this.$emit("userLogged");
        } catch (error) {
          this.loading = false;
          this.signupError = error.response.data.message;
          if (error.response.status >= 500) console.error(error.response);
        }
      }
    },
  },
};
</script>
