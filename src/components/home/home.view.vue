<template>
  <div>
    <h1 class="header">
      <font :color="$vuetify.theme.themes.light.secondary"
        >Bienvenido a T-Panel, {{ user.name }}</font
      >
    </h1>
    <v-row dense>
      <v-col cols="12">
        <span class="text-body-1 text--secondary"
          >Esta es una nueva aplicación que te permitirá gestionar todas las
          reparaciones de dispositivos que lleves a cabo en tu negocio.</span
        >
      </v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-icon>
              <v-icon color="primary"> mdi-check </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text-wrap">{{
                item
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "homeView",

  computed: {
    ...mapGetters(["user"]),
  },

  data: () => ({
    items: [
      "T-Panel es totalmente gratuito con apertura a donaciones al desarrollador",
      "Totalmente en la nube, nunca perderás tus datos",
      "Actualizaciones frecuentes sin tener que descargar nada",
      "Usable en cualquier dispositivo móvil",
      "Roles de usuario totalmente personalizables",
      "Manejo multi sucursal",
    ],
  }),
};
</script>
