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

export default {
  name: "App",

  computed: {
    ...mapGetters(["user"]),
  },

  mounted() {
    console.log(this.user);
  },
};
</script>
