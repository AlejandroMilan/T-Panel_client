<template>
  <div>
    <v-form>
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            outlined
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            outlined
            label="Contraseña"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" right>Iniciar sesión</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "loginForm",

  data: () => ({
    showPassword: false,
    email: "",
    password: "",
  }),
};
</script>
