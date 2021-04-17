<template>
  <v-app>
    <v-navigation-drawer app> </v-navigation-drawer>
    <v-app-bar app> </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app> </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
