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
