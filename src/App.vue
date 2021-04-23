<template>
  <v-app>
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
import { mapGetters } from "vuex";

import navigationDrawer from "./components/layout/navigationDrawer";

export default {
  name: "App",

  components: { navigationDrawer },

  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
