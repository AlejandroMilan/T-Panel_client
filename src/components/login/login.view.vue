<template>
  <v-row align="center">
    <v-col cols="12" md="6">
      <div id="banner">
        <v-card
          elevation="0"
          class="banner-card pb-2"
          :height="$vuetify.breakpoint.mdAndUp ? '96vh' : '30vh'"
        >
          <v-img
            src="https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            width="100%"
            height="95%"
          ></v-img>
          <v-card-text v-if="$vuetify.breakpoint.mdAndUp"
            >Desarrollado por: Dev Tek</v-card-text
          >
        </v-card>
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="welcome mb-5">
        <div>
          <span class="text-h3">Bienvenido</span>
        </div>
        <span class="text-body-1"
          >Para continuar, inicia sesión con tu cuenta o crea una nueva.</span
        >
      </div>
      <div class="form">
        <loginForm />
      </div>
      <div class="create-account">
        <createAccount />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import loginForm from "./loginForm";
import createAccount from "./createAccount";

export default {
  name: "loginView",

  components: {
    loginForm,
    createAccount,
  },
};
</script>
