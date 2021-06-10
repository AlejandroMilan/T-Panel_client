<template>
  <v-app-bar app>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="exit">
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "appBar",

  methods: {
    ...mapActions(["logOut"]),

    exit() {
      this.logOut();
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
