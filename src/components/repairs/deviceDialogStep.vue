<template>
  <div class="py-2">
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field
          v-model="trademark"
          label="Marca del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="trademark"
          label="Modelo del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="trademark"
          label="Color del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="trademark"
          label="IMEI/ESN (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="canStart"
          :label="`¿Puede encender?: ${canStart ? 'Sí' : 'No'}`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="beforeRepaired"
          :label="`¿Ya ha sido reparado?: ${beforeRepaired ? 'Sí' : 'No'}`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="blocking.hasBlocking"
          :label="`¿Tiene algún método de desbloqueo?: ${
            beforeRepaired ? 'Sí' : 'No'
          }`"
        ></v-checkbox>
      </v-col>
      <v-col v-if="blocking.hasBlocking" cols="12">
        <v-select
          v-model="blocking.blockingType"
          label="Tipo de desbloqueo"
          outlined
          :items="blockingTypes"
          item-text="name"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'pin'"
        cols="12"
      >
        <v-text-field
          v-model="trademark"
          label="PIN de desbloqueo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'password'"
        cols="12"
      >
        <v-text-field
          v-model="trademark"
          label="Contraseña de desbloqueo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'patreon'"
        cols="12"
      >
        <patreonCreator @change="updatePatreon"></patreonCreator>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import patreonCreator from "./patreonCreator";

export default {
  name: "deviceDialogStep",

  components: { patreonCreator },

  data: () => ({
    trademark: "",
    canStart: true,
    beforeRepaired: false,
    blocking: {
      hasBlocking: false,
      blockingType: "pin",
      patreon: [],
    },
    errors: {
      trademark: [],
    },
    blockingTypes: [
      {
        name: "PIN",
        value: "pin",
      },
      {
        name: "Contraseña",
        value: "password",
      },
      {
        name: "Patrón de desbloqueo",
        value: "patreon",
      },
    ],
  }),

  methods: {
    validateTrademark() {
      console.log(this.trademark);
    },

    updatePatreon(patreon) {
      this.blocking.patreon = patreon;
    },
  },
};
</script>