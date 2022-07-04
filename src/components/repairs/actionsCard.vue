<template>
  <div class="py-2">
    <v-card tile flat>
      <v-toolbar color="secondary" dark flat dense>
        <v-toolbar-title>Acciones</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 330).length > 0
            "
          >
            <v-btn color="secondary" small @click="$emit('editRepairInfo')" text
              ><v-icon small class="mr-2"> mdi-pencil</v-icon>Editar
              información</v-btn
            >
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 330).length > 0
            "
          >
            <v-btn color="secondary" small @click="$emit('showTechnician')" text
              ><v-icon small class="mr-2">mdi-account-arrow-right</v-icon>
              <span>Asignar a técnico</span></v-btn
            >
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 331).length > 0
            "
          >
            <v-btn
              color="secondary"
              small
              text
              @click="$emit('editRepairStatus')"
              ><v-icon small class="mr-2"> mdi-devices</v-icon>Cambiar
              estado</v-btn
            >
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 330).length > 0
            "
          >
            <v-btn
              color="secondary"
              small
              text
              @click="$emit('openMovementDialog')"
              ><v-icon small class="mr-2">mdi-swap-vertical</v-icon>
              <span>Agregar movimiento</span></v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn color="secondary" small text @click="$emit('addComment')"
              ><v-icon small class="mr-2"> mdi-message-reply-text</v-icon>Nuevo
              comentario</v-btn
            >
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 322).length > 0
            "
          >
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="secondary"
                  small
                  text
                  @click="$emit('printRepair')"
                  ><v-icon small class="mr-2"> mdi-printer</v-icon>Imprimir
                  nota</v-btn
                >
              </template>
              <span>No compatible con Mozilla Firefox</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 322).length > 0
            "
          >
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="secondary"
                  small
                  text
                  @click="$emit('printRepairTicket')"
                  ><v-icon small class="mr-2"> mdi-ticket-confirmation</v-icon
                  >Imprimir Ticket</v-btn
                >
              </template>
              <span>No compatible con Mozilla Firefox</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 322).length > 0
            "
          >
            <v-btn
              color="secondary"
              small
              text
              @click="$emit('downloadRepairPdf')"
              ><v-icon small class="mr-2"> mdi-download</v-icon>Descargar
              nota</v-btn
            >
          </v-col>
          <v-col cols="12" v-if="[0, 1, 2].indexOf(user.role.role) !== -1">
            <v-btn color="#075e54" small text @click="$emit('sendWhatsApp')">
              <v-icon small class="mr-2">mdi-whatsapp</v-icon> Enviar Whatsapp
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 340).length > 0
            "
          >
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
import { mapGetters } from "vuex";

export default {
  name: "actionsCard",

  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
