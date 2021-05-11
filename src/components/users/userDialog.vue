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
          <v-col cols="12">
            <v-select
              label="Tipo de usuario"
              v-model="role"
              :items="roles"
              item-value="role"
              item-text="name"
              :hint="
                roles.length > 0
                  ? roles.filter((e) => e.role == role)[0].description
                  : ''
              "
              persistent-hint
              outlined
              @change="updatePermissions"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Permisos a asignar"
              v-model="userPermissions"
              :items="permissions"
              item-value="key"
              item-text="description"
              multiple
              chips
              outlined
              hint="Al cambiar de tipo de usuario, se adaptarán los permissos correspondientes al tipo seleccionado. Sin embargo, puedes cambiarlos a tu gusto."
              persistent-hint
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "userDialog",

  mixins: [validationMixin, serverRequestMixin],

  props: {
    show: { type: Boolean, required: true },
  },

  data: () => ({
    loading: false,
    name: "",
    email: "",
    firstPassword: "",
    secondPassword: "",
    role: 0,
    userPermissions: [],
    errors: {
      name: [],
      email: [],
      firstPassword: [],
      secondPassword: [],
    },
    signupError: "",
    roles: [],
    permissions: [],
  }),

  validations: {
    name: { required, email, minLength: minLength(5) },
    email: { required, email },
    firstPassword: { required, minLength: minLength(8) },
    secondPassword: { required },
  },

  mounted() {
    this.getSignupData();
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

    async getSignupData() {
      this.loading = true;
      try {
        const response = await this.getRequest("/signupData");
        this.loading = false;
        console.log(response);
        this.roles = response.roles;
        this.permissions = response.permissions;
      } catch (error) {
        this.loading = false;
        this.signupError = error.response.data.message;
        if (error.response.status >= 500) console.error(error.response);
      }
    },

    updatePermissions() {
      const permissionsToUse = this.roles.filter((e) => e.role == this.role)[0]
        .defaultPermissions;

      const permissionsKeys = [];
      permissionsToUse.forEach((element) => {
        permissionsKeys.push(
          this.permissions.filter((e) => e._id == element)[0].key
        );
      });

      this.userPermissions = permissionsKeys;
    },
  },
};
</script>
