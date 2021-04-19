<template>
  <v-row align="center">
    <v-col cols="12" md="6">
      <div id="banner">
        <v-card
          elevation="0"
          class="banner-card"
          :height="$vuetify.breakpoint.mdAndUp ? '96vh' : '30vh'"
          color="primary"
        ></v-card>
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="welcome my-2">
        <div>
          <span class="text-h3">Bienvenido</span>
        </div>
        <span class="text-body-1"
          >Para continuar, inicia sesión con tu cuenta o crea una nueva.</span
        >
      </div>
      <div class="form">
        <loginForm></loginForm>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import loginForm from "./loginForm";

export default {
  name: "loginView",

  components: {
    loginForm,
  },

  mounted() {
    console.log(this.$vuetify.breakpoint);
  },
};
</script>
