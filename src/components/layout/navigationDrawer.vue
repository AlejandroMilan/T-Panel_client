<template>
  <v-navigation-drawer app v-model="isNavigating">
    <div class="user-details">
      <v-card tile color="secondary" dark class="pt-10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> {{ user.name }} </v-list-item-title>
            <v-list-item-subtitle>{{ user.role.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div class="nav">
      <v-list nav dense>
        <v-list-item-group v-model="routeSelected" color="primary">
          <v-list-item
            link
            v-for="(link, index) in links"
            :key="index"
            :disabled="!canView(link.permission)"
            :to="link.route"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "navigationDrawer",

  computed: {
    ...mapGetters(["user"]),
    isNavigating: {
      get: function () {
        return this.$store.state.isNavigating;
      },
      set: function (v) {
        this.$store.commit("setIsNavigating", v);
      },
    },
  },

  data: () => ({
    routeSelected: 0,
    links: [
      {
        title: "Inicio",
        icon: "mdi-home",
        route: "/panel/home",
      },
      {
        title: "Negocio",
        icon: "mdi-domain",
        route: "/panel/negocio",
      },
      {
        title: "Reparaciones",
        icon: "mdi-tablet-cellphone",
        route: "/panel/reparaciones",
        permission: 310,
      },
      {
        title: "Usuarios",
        icon: "mdi-account-multiple",
        route: "/panel/usuarios",
        permission: 110,
      },
    ],
  }),

  methods: {
    canView(permission) {
      if (!this.user || !this.user.businessId) return false;
      if (!permission) return true;
      if (this.user.role.role === 0) return true;
      if (
        this.user.permissions.filter(
          (permissionItem) => permissionItem.key === permission
        ).length > 0
      )
        return true;
      return false;
    },
  },
};
</script>
