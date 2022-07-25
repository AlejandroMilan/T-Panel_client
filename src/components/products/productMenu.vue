<template>
  <div>
    <v-menu left>
      <template #activator="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="menuItem in productMenu"
          :key="menuItem.emitAction"
          :disabled="!hasPermission(menuItem.permissionRequired)"
          @click="$emit(menuItem.emitAction)"
        >
          <v-list-item-icon class="ma-1 pt-3">
            <v-icon small :color="menuItem.color || null">{{
              menuItem.icon
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    productMenu: [
      {
        text: "Modificar información",
        icon: "mdi-pencil",
        emitAction: "updateProductInfo",
        permissionRequired: 535,
      },
      {
        text: "Agregar stock a sucursal",
        icon: "mdi-store-plus",
        emitAction: "addStockToBranchOffice",
        permissionRequired: 533,
      },
      {
        text: "Eliminar producto",
        icon: "mdi-delete",
        emitAction: "deleteProduct",
        color: "error",
        permissionRequired: 543,
      },
    ],
  }),

  computed: {
    ...mapGetters(["hasPermission"]),
  },
};
</script>
