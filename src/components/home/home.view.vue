<template>
  <div>
    <v-card color="secondary" dark>
      <v-card-title>Bienvenido a T-Panel {{ user.name }}</v-card-title>
      <v-card-subtitle
        >Esta aplicación te ayudará a gestionar todas las reparaciones de tu
        negocio en la nube.</v-card-subtitle
      >
      <v-card-text>
        <v-list light>
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
      </v-card-text>
    </v-card>
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
