<template>
  <v-card :loading="loading" tile>
    <v-card-title class="secondary--text"
      >Buen día {{ user.name.split(" ")[0] }}</v-card-title
    >
    <v-card-text>
      <loading-count v-if="loading" :expectedLength="5"></loading-count>
      <div v-else class="d-md-flex">
        <v-card
          v-for="statusItem in repairsStatusCount"
          :key="statusItem.status.key"
          color="secondary"
          dark
          :width="statusItemWidth"
          class="ma-1"
        >
          <v-card-title>
            <span>{{ statusItem.count }}</span>
            <v-spacer></v-spacer>
            <v-chip
              label
              :color="getRepairStatusColor(statusItem.status.key)"
              link
              :to="{
                name: 'Reparaciones',
                query: { status: statusItem.status.key },
              }"
              >{{ statusItem.status.title }}</v-chip
            >
          </v-card-title>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import repairsCountLoading from "./repairsCount.loading.vue";

export default {
  props: {
    loading: { type: Boolean, default: false },
    repairsStatusCount: { type: Array, default: () => [] },
  },

  components: {
    "loading-count": repairsCountLoading,
  },

  computed: {
    ...mapGetters(["user", "getRepairStatusColor"]),

    isMobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },

    statusItemWidth() {
      const { length } = this.repairsStatusCount;
      if (length && !this.isMobile) return `${100 / length}%`;
      else return "100%";
    },
  },
};
</script>
