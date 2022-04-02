<template>
  <div>
    <span v-if="patreon.length == 0" class="text-body-1 pb-2"
      >Para agregar el patrón, da click en los círculos en el orden
      correspondiente.</span
    >
    <div class="d-flex justify-end py-1" v-if="!readOnly">
      <v-btn
        color="secondary"
        small
        outlined
        v-if="patreon.length > 0"
        @click="
          patreon = [];
          emitPatreon();
        "
        >Volver a empezar</v-btn
      >
    </div>
    <v-card outlined class="pa-2">
      <v-row>
        <v-col cols="4" v-for="i in 9" :key="i" class="d-flex justify-center">
          <v-btn
            fab
            :color="isInPatreon(i) ? 'secondary' : 'grey'"
            small
            @click="
              !isInPatreon(i) && !readOnly && patreon.push(i) && emitPatreon()
            "
          >
            <span>{{ isInPatreon(i) ? patreon.indexOf(i) + 1 : null }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "patreonCreator",

  props: {
    readOnly: { type: Boolean, default: false },
    current: { type: Array, required: false },
  },

  watch: {
    current() {
      if (this.current && this.current.length) this.patreon = this.current;
    },
  },

  data: () => ({
    patreon: [],
  }),

  mounted() {
    if (this.current && this.current.length) this.patreon = this.current;
  },

  methods: {
    isInPatreon(number) {
      return this.patreon.indexOf(number) !== -1;
    },

    emitPatreon() {
      this.$emit("change", this.patreon);
    },
  },
};
</script>
