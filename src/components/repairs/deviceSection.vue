<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-subheader>Dispositivo</v-subheader>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item dense>
          <v-list-item-content>
            <v-list-item-subtitle
              >Puede encender sin complicación</v-list-item-subtitle
            >
            <v-list-item-title>
              <div class="d-flex">
                <v-checkbox
                  readonly
                  v-model="deviceData.canStart"
                  class="ma-0"
                ></v-checkbox>
                <span class="text-body-1 mt-1">{{
                  deviceData.canStart ? "Sí" : "No"
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item dense>
          <v-list-item-content>
            <v-list-item-subtitle
              >Reparado con anterioridad</v-list-item-subtitle
            >
            <v-list-item-title>
              <div class="d-flex">
                <v-checkbox
                  readonly
                  v-model="deviceData.beforeRepaired"
                  class="ma-0"
                ></v-checkbox>
                <span class="text-body-1 mt-1">{{
                  deviceData.beforeRepaired ? "Sí" : "No"
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12">
        <v-list-item dense>
          <v-list-item-content>
            <v-list-item-subtitle>Presenta humedad</v-list-item-subtitle>
            <v-list-item-title>
              <div class="d-flex">
                <v-checkbox
                  readonly
                  v-model="deviceData.presentsMoisture"
                  class="ma-0"
                ></v-checkbox>
                <span class="text-body-1 mt-1">{{
                  deviceData.presentsMoisture ? "Sí" : "No"
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Marca</v-list-item-subtitle>
            <v-list-item-title>{{ deviceData.trademark }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Modelo</v-list-item-subtitle>
            <v-list-item-title>{{ deviceData.model }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Color</v-list-item-subtitle>
            <v-list-item-title>{{ deviceData.color }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Motivo de ingreso/falla</v-list-item-subtitle>
            <v-list-item-title>{{
              deviceData.reasonForAdmission
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-row v-if="deviceData.blocking.hasBlocking" dense>
        <v-col
          cols="12"
          :md="deviceData.blocking.blockingType === 'patreon' ? '8' : '6'"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Método de desbloqueo</v-list-item-subtitle>
              <v-list-item-title>{{
                getBlockingTypeString(deviceData.blocking.blockingType)
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          md="6"
          v-if="
            ['pin', 'password'].indexOf(deviceData.blocking.blockingType) !== -1
          "
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Contraseña o PIN</v-list-item-subtitle>
              <v-list-item-title>{{
                deviceData.blocking.pin || deviceData.blocking.password
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          md="5"
          v-if="deviceData.blocking.blockingType === 'patreon'"
          class="mb-2"
        >
          <v-card color="grey lighten-4" elevation="0">
            <v-subheader>Patrón de desbloqueo</v-subheader>
            <v-card-text>
              <patreonCreator
                :readOnly="true"
                :current="deviceData.blocking.patreon"
              ></patreonCreator>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-if="deviceData.blocking.blockingType === 'patreon'"
          cols="7"
        ></v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import patreonCreator from "./patreonCreator";

export default {
  name: "deviceSection",

  components: {
    patreonCreator,
  },

  props: {
    deviceData: { type: Object, required: true },
  },

  methods: {
    getBlockingTypeString(blockingType) {
      if (blockingType === "pin") return "PIN";
      if (blockingType === "password") return "Contraseña";
      if (blockingType === "patreon") return "Patrón de desbloqueo";
    },
  },
};
</script>
