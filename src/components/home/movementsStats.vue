<template>
  <div>
    <v-card tile>
      <v-card-title class="secondary--text"
        >Movimientos económicos mensuales</v-card-title
      >
      <v-card-subtitle
        >Se han registrado {{ movementsInfo.movementsCount }} movimientos este
        mes.</v-card-subtitle
      >

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-icon color="green" class="mr-2">mdi-arrow-up</v-icon>
                <span>{{ currencyFormat(movementsInfo.entriesTotal) }}</span>
              </v-card-title>
              <v-card-subtitle
                >Ingresado en
                {{ movementsInfo.entriesCount }} movimientos</v-card-subtitle
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-icon color="red" class="mr-2">mdi-arrow-down</v-icon>
                <span>{{ currencyFormat(movementsInfo.billsTotal) }}</span>
              </v-card-title>
              <v-card-subtitle
                >Gastado en
                {{ movementsInfo.billsCount }} movimientos</v-card-subtitle
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-chip
                  :color="movementsInfo.gain > 0 ? 'green darken-2' : 'red'"
                  label
                  dark
                  >{{ currencyFormat(movementsInfo.gain) }}</v-chip
                >
              </v-card-title>
              <v-card-subtitle>En ganancias</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { currencyFormat } from "@/helpers/numbers.helper";

export default {
  props: {
    movementsInfo: { type: Object, required: true },
  },

  methods: {
    currencyFormat,
  },
};
</script>
