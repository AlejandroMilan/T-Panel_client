<template>
  <div>
    <v-progress-linear
      indeterminate
      color="primary"
      v-if="loading"
    ></v-progress-linear>
    <v-row v-else dense>
      <v-col cols="12">
        <div class="d-flex justify-end">
          <v-btn color="primary" @click="showRepairDialog = true">
            <v-icon>mdi-plus</v-icon>
            Nueva reparación</v-btn
          >
          <repairDialog :show="showRepairDialog"></repairDialog>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import repairDialog from "./repairDialog";

export default {
  name: "repairsView",

  components: {
    repairDialog,
  },

  data: () => ({
    loading: false,
    showRepairDialog: false,
  }),
};
</script>
