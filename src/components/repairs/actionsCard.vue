<template>
  <div class="py-2">
    <v-card outlined>
      <v-card-title>Acciones</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-btn color="primary" small @click="$emit('editRepairInfo')" text
              ><v-icon small class="mr-2"> mdi-pencil</v-icon>Editar
              información</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn color="accent" small text @click="$emit('editRepairStatus')"
              ><v-icon small class="mr-2"> mdi-devices</v-icon>Cambiar
              estado</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn color="secondary" small text
              ><v-icon small class="mr-2"> mdi-message-reply-text</v-icon>Nuevo
              comentario</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn
              color="error darken-2"
              small
              text
              @click="$emit('deleteRepair')"
              ><v-icon small class="mr-2"> mdi-delete</v-icon>Eliminar
              reparación</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "actionsCard",
};
</script>
