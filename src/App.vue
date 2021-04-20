<template>
  <v-app>
    <v-navigation-drawer v-if="user" app></v-navigation-drawer>
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
import { mapGetters } from "vuex";

import { validateSession } from "./auth.service";

export default {
  name: "App",

  computed: {
    ...mapGetters(["user", "httpUrl"]),
  },

  async beforeMount() {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      try {
        const response = await validateSession(this.httpUrl, sessionToken);
        this.$store.dispatch("setUser", response.data.user);
        this.$store.dispatch("setSessionToken", sessionToken);
        if (this.$route.path === "/login") this.$router.replace("/panel");
      } catch (error) {
        if (error.response.status >= 500) console.error(error);
        else {
          console.error(
            "Error al cargar la sesión actual, usuario no encontrado o sesión caducada"
          );
          localStorage.removeItem("sessionToken");
          if (this.$route.path !== "/login") this.$router.replace("/login");
        }
      }
    }
  },
};
</script>
