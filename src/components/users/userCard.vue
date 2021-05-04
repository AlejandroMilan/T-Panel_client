<template>
  <v-card outlined>
    <v-card-title>
      <a href="javascript:void(0)" class="text-decoration-none">{{
        user.name
      }}</a>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item-group>
            <v-list-item v-for="(option, index) in options" :key="index">
              <v-list-item-icon
                ><v-icon :color="option.color">{{
                  option.icon
                }}</v-icon></v-list-item-icon
              >
              <v-list-item-title>{{ option.title }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle> Administrador </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: "userCard",

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    options: [
      {
        title: "Modificar",
        color: "primary",
        icon: "mdi-pencil",
      },
      {
        title: "Eliminar",
        color: "error",
        icon: "mdi-delete",
      },
    ],
  }),
};
</script>
