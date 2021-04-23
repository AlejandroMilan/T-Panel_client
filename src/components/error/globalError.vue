<template>
  <v-dialog v-model="show" max-width="450">
    <v-card>
      <v-card-title>
        {{ error.title }}
      </v-card-title>
      <v-card-text>
        {{ error.message }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="clearGlobalError">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "globalError",

  props: ["error", "show"],

  methods: { ...mapActions(["clearGlobalError"]) },
};
</script>
