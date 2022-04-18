<template>
  <v-app-bar app color="secondary" dark>
    <v-btn icon @click="isNavigating = !isNavigating">
      <v-icon color="primary">mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip left color="primary">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          elevation="0"
          @click="exit"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small color="secondary">mdi-exit-to-app</v-icon>
        </v-btn>
      </template>
      <span class="secondary--text">Cerrar sesión</span>
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
