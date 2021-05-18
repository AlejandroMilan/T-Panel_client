<template>
  <div>
    <v-dialog
      persistent
      v-model="show"
      :fullscreen="!$vuetify.breakpoint.mdAndUp"
      :width="$vuetify.breakpoint.mdAndUp ? '750' : null"
    >
      <v-card>
        <v-card-title>Agregar reparación</v-card-title>
        <v-card-text>
          <v-stepper v-model="formStep" vertical class="elevation-0">
            <v-stepper-step step="1">Datos del dispositivo</v-stepper-step>
            <v-stepper-step step="2">Datos del cliente</v-stepper-step>
            <v-stepper-step step="3">
                Otros datos
                <small>Folio del servicio, costos</small>
            </v-stepper-step>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "repairDialog",

  props: {
    show: { type: Boolean, defualt: false },
  },

  data: () => ({
    formStep: 1,
  }),
};
</script>