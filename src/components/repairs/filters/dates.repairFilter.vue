<template>
  <v-row dense>
    <v-col cols="12">
      <v-menu v-model="menuSince" bottom>
        <template #activator="{ on, attrs }">
          <v-text-field
            v-on="on"
            v-bind="attrs"
            :value="sinceLocal"
            readonly
            label="Desde"
            outlined
            dense
            color="secondary"
            prepend-inner-icon="mdi-calendar-range"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="sinceLocal"
          color="secondary"
          locale="es"
          no-title
          scrollable
          @change="emitSince()"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menuSince = false">Ok</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-menu v-model="menuUntil" bottom>
        <template #activator="{ on, attrs }">
          <v-text-field
            v-on="on"
            v-bind="attrs"
            :value="untilLocal"
            readonly
            label="Hasta"
            outlined
            dense
            color="secondary"
            prepend-inner-icon="mdi-calendar-range"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="untilLocal"
          color="secondary"
          locale="es"
          no-title
          scrollable
          @change="emitUntil()"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menuUntil = false">Ok</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    since: { type: String, default: null },
    until: { type: String, default: null },
  },

  data() {
    return {
      sinceLocal: this.since,
      untilLocal: this.until,
      menuSince: false,
      menuUntil: false,
    };
  },

  watch: {
    since(value) {
      this.sinceLocal = value;
    },

    until(value) {
      this.untilLocal = value;
    },

    "$route.query"() {
      this.resetQuery();
    },
  },

  methods: {
    emitSince() {
      this.$emit("queryPropChanged", { since: this.sinceLocal });
    },

    emitUntil() {
      this.$emit("queryPropChanged", { until: this.untilLocal });
    },

    resetQuery() {
      if (!this.$route.query.since) this.sinceLocal = "";
      if (!this.$route.query.until) this.untilLocal = "";
    },
  },
};
</script>
