<template>
  <div>
    <v-card tile :loading="loading">
      <v-card-title class="secondary--text">Estadísticas</v-card-title>
      <v-card-subtitle class="py-2">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-menu bottom :disabled="loading">
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="sinceDate"
                      v-on="on"
                      v-bind="attrs"
                      label="Desde"
                      readonly
                      outlined
                      prepend-inner-icon="mdi-calendar"
                      dense
                      color="secondary"
                      :disabled="loading"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="sinceDate"
                    color="secondary"
                    locale="es"
                    :max="untilDate || null"
                    @change="addToQuery({ since: sinceDate })"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu bottom :disabled="loading">
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="untilDate"
                      v-on="on"
                      v-bind="attrs"
                      label="Hasta"
                      readonly
                      outlined
                      prepend-inner-icon="mdi-calendar"
                      dense
                      color="secondary"
                      :disabled="loading"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="untilDate"
                    color="secondary"
                    locale="es"
                    :min="sinceDate || null"
                    @change="addToQuery({ until: untilDate })"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-icon color="green" class="mr-2">mdi-arrow-up</v-icon>
                <span>{{
                  currencyFormat(movementsInfoLocal.entriesTotal)
                }}</span>
              </v-card-title>
              <v-card-subtitle
                >Ingresado en
                {{ movementsInfoLocal.entriesCount }}
                movimientos</v-card-subtitle
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-icon color="red" class="mr-2">mdi-arrow-down</v-icon>
                <span>{{ currencyFormat(movementsInfoLocal.billsTotal) }}</span>
              </v-card-title>
              <v-card-subtitle
                >Gastado en
                {{ movementsInfoLocal.billsCount }} movimientos</v-card-subtitle
              >
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>
                <v-chip
                  :color="
                    movementsInfoLocal.gain > 0 ? 'green darken-2' : 'red'
                  "
                  label
                  dark
                  >{{ currencyFormat(movementsInfoLocal.gain) }}</v-chip
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
import { DateTime } from "luxon";
import serverRequestMixin from "@/mixins/serverRequest.mixin.js";
import { currencyFormat } from "@/helpers/numbers.helper";

export default {
  mixins: [serverRequestMixin],

  props: {
    movementsInfo: { type: Object, required: true },
  },

  data() {
    return {
      movementsInfoLocal: this.movementsInfo,
      loading: false,
      sinceMenu: false,
      untilMenu: false,
      sinceDate: null,
      untilDate: null,
    };
  },

  watch: {
    $route() {
      this.setCurrentData();
      this.getDashboard();
    },
  },

  mounted() {
    this.setCurrentData();
  },

  methods: {
    currencyFormat,

    setCurrentData() {
      this.sinceDate =
        this.$route.query.since ||
        DateTime.fromISO(this.movementsInfo.since).toFormat("yyyy-MM-dd");
      this.untilDate =
        this.$route.query.until ||
        DateTime.fromISO(this.movementsInfo.until).toFormat("yyyy-MM-dd");
    },

    addToQuery(newParam) {
      const query = {
        ...this.$route.query,
        ...newParam,
      };

      this.$router.push({ name: "Panel", query });
    },

    async getDashboard() {
      this.loading = true;

      try {
        const query = {
          ...(this.$route.query.since && { since: this.$route.query.since }),
          ...(this.$route.query.until && { until: this.$route.query.until }),
        };
        const serverResponse = await this.getRequest(
          "/business/dashboard",
          true,
          query
        );
        this.loading = false;

        this.movementsInfoLocal = serverResponse.movementsInfo;
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else this.error = "Error al establecer conexión con el servidor";
      }
    },
  },
};
</script>
