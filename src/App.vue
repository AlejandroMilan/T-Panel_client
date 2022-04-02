<template>
  <v-app>
    <globalError
      v-if="globalError"
      :show="globalError"
      :error="globalError"
    ></globalError>
    <navigationDrawer v-if="user"></navigationDrawer>
    <appBar v-if="user"></appBar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer v-if="user" app color="#e3e3e3">
      <v-row dense>
        <v-col cols="12">
          <div class="d-flex justify-center">
            <span class="text-caption"
              >T-Panel V{{ version }} - Dev Tek 2021</span
            >
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { version } from "../package";
import { mapGetters, mapActions } from "vuex";

import globalError from "./components/error/globalError";
import navigationDrawer from "./components/layout/navigationDrawer";
import appBar from "./components/layout/appBar.vue";

export default {
  name: "App",

  components: { navigationDrawer, globalError, appBar },

  computed: {
    ...mapGetters(["user", "sessionToken", "globalError"]),
  },

  data: () => ({
    version: version,
  }),

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

<style lang="scss">
#app {
  background-color: var(--v-background-base);
}

.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}

.link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
