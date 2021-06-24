<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon
      @click="isNavigating = !isNavigating"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip left color="primary">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon @click="exit" v-bind="attrs" v-on="on">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
      </template>
      <span>Cerrar sesión</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "appBar",

  computed: {
    isNavigating: {
      get() {
        return this.$store.getters.isNavigating;
      },
      set(v) {
        return this.$store.commit("setIsNavigating", v);
      },
    },
  },

  methods: {
    ...mapActions(["logOut"]),

    exit() {
      this.logOut();
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
