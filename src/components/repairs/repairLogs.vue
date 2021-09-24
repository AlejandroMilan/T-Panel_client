<template>
  <div>
    <v-card color="secondary" dark>
      <v-card-title>Cambios en la reparación</v-card-title>
    </v-card>
    <div v-if="!logs.length" class="text-body pa-2 secondary--text">
      <span>No se han registrado cambios en esta reparación.</span>
    </div>
    <v-timeline dense align-top v-for="log in organizedLogs" :key="log._id">
      <v-timeline-item color="secondary" small>
        <v-row dense>
          <v-col cols="12">{{ formatDate(log.date) }}</v-col>
          <v-col cols="12">
            <div class="text-caption">{{ log.username }}</div>
            <strong>{{ log.content }}</strong>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { getFullDateWithHour } from "@/helpers/date.helper";

export default {
  name: "repairLogs",

  props: {
    logs: { type: Array, default: () => [] },
  },

  data: () => ({
    organizedLogs: [],
  }),

  mounted() {
    this.organizeLogs();
  },

  methods: {
    organizeLogs() {
      this.organizedLogs = this.logs.reverse();
    },

    formatDate(ISODate) {
      return getFullDateWithHour(ISODate);
    },
  },
};
</script>
