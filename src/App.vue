<template>
  <v-app>
    <globalError
      v-if="globalError"
      :show="globalError"
      :error="globalError"
    ></globalError>
    <navigationDrawer v-if="user"></navigationDrawer>
    <v-app-bar v-if="user" app></v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer v-if="user" app> </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import globalError from "./components/error/globalError";
import navigationDrawer from "./components/layout/navigationDrawer";

export default {
  name: "App",

  components: { navigationDrawer, globalError },

  computed: {
    ...mapGetters(["user", "sessionToken", "globalError"]),
  },

  async mounted() {
    if (this.user) {
      try {
        await this.validateSession(this.sessionToken);
      } catch (error) {
        this.setGlobalError({
          title: "Sesión caducada",
          message:
            "La sesión ha caducado, por favor, vuelva a iniciar sesión con su cuenta.",
        });
        this.logOut();
        this.$router.push("/login");
      }
    }
  },

  methods: {
    ...mapActions(["validateSession", "logOut", "setGlobalError"]),
  },
};
</script>
