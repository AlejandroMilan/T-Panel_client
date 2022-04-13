<template>
  <v-dialog width="600" v-model="show" persistent>
    <v-card :loading="loading">
      <v-card-title>
        <span>{{ currentUser ? currentUser.name : "Nuevo usuario" }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" v-if="signupError" class="my-5">
            <v-alert type="error" dense outlined>{{ signupError }}</v-alert>
          </v-col>
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
            ></v-text-field>
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
          <v-col v-if="!currentUser" cols="12" md="6">
            <v-text-field
              v-model="firstPassword"
              label="Contraseña asignada"
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
          <v-col v-if="!currentUser" cols="12" md="6">
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
          <v-col cols="12">
            <v-select
              label="Tipo de usuario"
              v-model="role"
              :items="roles"
              item-value="role"
              item-text="name"
              color="secondary"
              item-color="secondary"
              :hint="
                roles.length > 0
                  ? roles.filter((e) => e.role == role)[0].description
                  : ''
              "
              persistent-hint
              :disabled="loading"
              outlined
              @change="updatePermissions"
              @focus="updatePermissions"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Sucursal asignada"
              v-model="branchOffice"
              :items="branchOffices"
              item-value="_id"
              item-text="name"
              color="secondary"
              item-color="secondary"
              hint="La sucursal limitará las reparaciones a las que el usuario tendrá accesso"
              :disabled="loading"
              persistent-hint
              outlined
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
              color="secondary"
              item-color="secondary"
              hint="Al cambiar de tipo de usuario, se adaptarán los permisos correspondientes al tipo seleccionado. Sin embargo, puedes cambiarlos a tu gusto."
              persistent-hint
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" outlined @click="$emit('cancel')">
          <v-icon small class="mr-2">mdi-close</v-icon>
          <span>Cancelar</span>
        </v-btn>
        <v-btn
          color="primary"
          dark
          :disabled="loading || !isFormValid"
          :loading="loading"
          @click="submit"
        >
          <v-icon small class="mr-2">mdi-content-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "userDialog",

  mixins: [validationMixin, serverRequestMixin],

  props: {
    show: { type: Boolean, required: true },
    currentUser: { type: Object, default: null },
  },

  computed: {
    ...mapGetters(["user"]),
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
    role: 1,
    userPermissions: [],
    branchOffice: "",
    errors: {
      name: [],
      email: [],
      firstPassword: [],
      secondPassword: [],
    },
    signupError: "",
    roles: [],
    permissions: [],
    branchOffices: [],
  }),

  validations: {
    name: { required, email, minLength: minLength(5) },
    email: { required, email },
    firstPassword: { required, minLength: minLength(8) },
    secondPassword: { required },
  },

  async mounted() {
    await this.getSignupData();
    await this.getBranchOffices();
    if (this.currentUser) {
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
      this.role = this.currentUser.role.role;
      let userPermissions = [];
      this.currentUser.permissions.forEach((e) => {
        userPermissions = [...userPermissions, e.key];
      });
      this.userPermissions = userPermissions;
    }
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
        this.roles = response.roles;
        this.permissions = response.permissions;
      } catch (error) {
        this.loading = false;
        this.signupError = error.response.data.message;
        if (error.response.status >= 500) console.error(error.response);
      }
    },

    async getBranchOffices() {
      this.loading = true;
      try {
        const serverResponse = await this.getRequest("/branchOffices");
        this.loading = false;
        this.branchOffices = serverResponse.branchOffices;
        this.branchOffice = this.currentUser
          ? this.currentUser.branchOffice._id
          : serverResponse.branchOffices[0]._id;
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

    async submit() {
      this.signupError = "";
      this.validateName();
      this.validateEmail();
      if (!this.currentUser) this.validateFirstPassword();
      if (!this.currentUser) this.validateSecondPassword();
      if (!this.isFormValid) return;
      this.loading = true;
      try {
        const sendData = this.currentUser
          ? {
              name: this.name,
              email: this.email,
              role: this.role,
              permissions: this.userPermissions,
              branchOffice: this.branchOffice,
            }
          : {
              name: this.name,
              email: this.email,
              password: this.firstPassword,
              role: this.role,
              permissions: this.userPermissions,
              branchOffice: this.branchOffice,
            };

        const response = this.currentUser
          ? await this.putRequest(
              `users/${this.user.businessId}/${this.currentUser._id}`,
              sendData
            )
          : await this.postRequest(
              `users/signup/${this.user.businessId}`,
              sendData
            );
        this.loading = false;
        const emitData = this.currentUser
          ? response.userUpdated
          : response.user;
        this.$emit("userSaved", emitData);
      } catch (error) {
        this.loading = false;
        this.signupError = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
