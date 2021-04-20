<template>
  <div class="my-5">
    <v-row no-gutters justify="start">
      <v-col cols="auto">
        <span class="text-body-2">¿No tienes cuenta?</span>
      </v-col>
      <v-col cols="auto">
        <v-btn text small color="primary" @click="showRegister = true"
          >Crea una</v-btn
        >
      </v-col>
    </v-row>
    <v-dialog
      v-if="showRegister"
      :fullscreen="!$vuetify.breakpoint.mdAndUp"
      :width="$vuetify.breakpoint.mdAndUp ? '600' : null"
      persistent
      v-model="showRegister"
    >
      <v-card>
        <v-card-title>
          <span class="text-title">Crear una cuenta</span>
        </v-card-title>
        <v-card-text>
          <span
            >Para registrar una nueva cuenta, solo tienes que llenar los
            siguientes datos.</span
          >
          <v-alert type="warning" dense text
            >Este registro solo es para dueños de talleres, si no lo eres y
            necesitas registrate, pide al dueño del taller o a un administrador
            que lleve a cabo tu registro.</v-alert
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "createAccount",

  data: () => ({
    showRegister: false,
  }),
};
</script>
