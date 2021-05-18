<template>
  <v-navigation-drawer app>
    <div class="user-details">
      <v-card tile color="secondary" dark class="pt-10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Alejandro Milán </v-list-item-title>
            <v-list-item-subtitle>Administrador</v-list-item-subtitle>
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
            :disabled="!user || !user.businessId"
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
      },
      {
        title: "Usuarios",
        icon: "mdi-account-multiple",
        route: "/panel/usuarios",
      },
    ],
  }),
};
</script>
