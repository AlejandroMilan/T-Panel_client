<template>
  <v-row>
    <div class="d-md-flex">
      <v-skeleton-loader
        v-for="i in expectedLength"
        :key="i"
        type="image"
        height="100"
        :width="itemWidth"
      ></v-skeleton-loader>
    </div>
  </v-row>
</template>

<script>
export default {
  props: {
    expectedLength: { type: Number, default: 4 },
  },

  computed: {
    isMobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },

    itemWidth() {
      const { length } = this.expectedLength;
      if (length && !this.isMobile) return `${100 / length}%`;
      else return "100%";
    },
  },
};
</script>
