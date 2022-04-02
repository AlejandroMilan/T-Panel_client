<template>
  <v-navigation-drawer app v-model="isNavigating">
    <div class="user-details">
      <v-card tile color="secondary" dark class="pt-10">
        <div class="px-5">
          <v-img :src="require('../../assets/logo.jpeg')" width="100%"></v-img>
        </div>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> {{ user.name }} </v-list-item-title>
            <v-list-item-subtitle>{{ user.role.name }}</v-list-item-subtitle>
            <v-list-item-subtitle v-if="user.branchOffice">
              <v-chip color="primary">{{
                user.branchOffice.name
              }}</v-chip></v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div class="nav">
      <v-list nav dense>
        <v-list-item-group v-model="routeSelected" color="primary">
          <v-list-item
            color="secondary"
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

    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="secondary" small block @click="showDonationDialog = true">
          <v-icon small>mdi-currency-usd</v-icon>
          <span>Realizar donación</span>
        </v-btn>
      </div>
    </template>

    <donation-dialog
      v-if="showDonationDialog"
      :show="showDonationDialog"
      @cancel="showDonationDialog = false"
    ></donation-dialog>
  </v-navigation-drawer>
</template>

<script>
import donationDialog from "./donationDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "navigationDrawer",

  components: { "donation-dialog": donationDialog },

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
      {
        title: "Sucursales",
        icon: "mdi-store",
        route: "/panel/sucursales",
      },
    ],

    showDonationDialog: false,
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
