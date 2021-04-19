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
          ></v-text-field>
          <forgottenPassword />
        </v-col>
        <v-col cols="12" class="mt-5">
          <v-btn color="primary">Iniciar sesión</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import forgottenPassword from "./forgottenPassword";

export default {
  name: "loginForm",

  components: {
    forgottenPassword,
  },

  data: () => ({
    showPassword: false,
    email: "",
    password: "",
  }),
};
</script>
