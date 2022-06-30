<template>
  <v-row dense>
    <v-col cols="12" :md="isFullWidth ? '4' : '12'">
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
            :append-icon="sinceLocal ? 'mdi-close' : null"
            prepend-inner-icon="mdi-calendar-range"
            @click:append="
              sinceLocal = '';
              changeQuery({ since: '' });
            "
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="sinceLocal"
          color="secondary"
          locale="es"
          no-title
          scrollable
          :max="untilLocal ? untilLocal : null"
          @change="emitSince()"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menuSince = false">Ok</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" :md="isFullWidth ? '4' : '12'">
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
            :append-icon="untilLocal ? 'mdi-close' : null"
            @click:append="
              untilLocal = '';
              changeQuery({ until: '' });
            "
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="untilLocal"
          color="secondary"
          locale="es"
          no-title
          scrollable
          :min="sinceLocal ? sinceLocal : null"
          @change="emitUntil()"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menuUntil = false">Ok</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col
      v-if="sinceLocal || untilLocal"
      cols="12"
      :md="isFullWidth ? '4' : '12'"
    >
      <v-select
        v-model="useDatesForLocal"
        :items="useDatesForValues"
        item-text="text"
        item-value="value"
        color="secondary"
        item-color="secondary"
        outlined
        dense
        label="Usar filtros de fechas para"
        @change="emitUseDatesFor()"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
import routeQueryMixin from "@/mixins/routeQuery.mixin.js";

export default {
  mixins: [routeQueryMixin],

  props: {
    since: { type: String, default: null },
    until: { type: String, default: null },
    isFullWidth: { type: Boolean, default: false },
  },

  data() {
    return {
      sinceLocal: this.since,
      untilLocal: this.until,
      menuSince: false,
      menuUntil: false,
      useDatesForLocal: "admissionDate",
      useDatesForValues: [
        {
          text: "Fecha de recibido",
          value: "admissionDate",
        },
        {
          text: "Fecha de entregado al cliente",
          value: "deliveryDate",
        },
      ],
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

  mounted() {
    this.setCurrentData();
  },

  methods: {
    setCurrentData() {
      if (this.$route.query.useDatesFor)
        this.useDatesForLocal = this.$route.query.useDatesFor;
    },

    emitSince() {
      this.changeQuery({ since: this.sinceLocal });
    },

    emitUntil() {
      this.changeQuery({ until: this.untilLocal });
    },

    emitUseDatesFor() {
      this.changeQuery({ useDatesFor: this.useDatesForLocal });
    },

    resetQuery() {
      if (!this.$route.query.since) this.sinceLocal = "";
      if (!this.$route.query.until) this.untilLocal = "";
    },
  },
};
</script>
