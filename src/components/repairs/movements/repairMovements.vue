<template>
  <div>
    <v-card flat tile>
      <v-card-title class="d-flex align-items-center">
        <span>Movimientos económicos</span>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-on="on" v-bind="attrs" small class="ml-2"
              >mdi-help-circle</v-icon
            >
          </template>
          Todos los gastos e ingresos de la reparación pueden ser agregados aquí
          para calcular las ganancias
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <span v-if="!movements.length">Sin movimientos agregados</span>
        <div v-else>
          <v-card v-for="movement in movements" :key="movement._id" flat tile>
            <v-list-item>
              <v-list-item-icon>
                <v-icon :color="isBill(movement) ? 'red' : 'green'">{{
                  isBill(movement) ? "mdi-arrow-down" : "mdi-arrow-up"
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span
                    >{{ movement.description }} -
                    {{ getFullDateWithHour(movement.date) }}</span
                  >
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ currencyFormat(movement.amount) }} -
                  {{ movement.user.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { currencyFormat } from "@/helpers/numbers.helper";
import { getFullDateWithHour } from "@/helpers/date.helper";

export default {
  props: {
    movements: { type: Array, default: () => [] },
  },

  methods: {
    currencyFormat,
    getFullDateWithHour,

    isBill(movement) {
      return movement.movementType === "bill";
    },
  },
};
</script>
