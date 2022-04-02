<template>
  <v-dialog v-model="show" width="400" persistent>
    <v-card :loading="loading">
      <v-card-title>Modificar estado</v-card-title>
      <v-card-text>
        <v-alert v-if="error" dense type="error" outlined>{{ error }}</v-alert>
        <v-row dense>
          <v-col cols="12">
            <v-select
              v-model="status"
              outlined
              dense
              color="secondary"
              item-color="secondary"
              label="Nuevo estado"
              :items="statusItems"
              item-text="title"
              item-value="key"
              :disabled="loading"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          :disabled="loading"
          outlined
          @click="$emit('cancel')"
        >
          <v-icon small class="mr-2">mdi-close</v-icon>
          <span>Cancelar</span>
        </v-btn>
        <v-btn color="primary" :disabled="loading" @click="submit">
          <v-icon small class="mr-2" color="secondary">mdi-content-save</v-icon>
          <span class="secondary--text">Guardar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "updateStatusDialog",

  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, default: true },
    invoiceId: { type: [Number, String, Array], required: true },
    currentStatus: { type: Number, required: true },
  },

  watch: {
    currentStatus() {
      this.status = this.currentStatus;
    },
  },

  data: () => ({
    loading: false,
    error: "",
    statusItems: [],
    status: "",
  }),

  mounted() {
    this.status = this.currentStatus;
    this.getStatusList();
  },

  methods: {
    async getStatusList() {
      this.loading = true;
      try {
        const serverResponse = await this.getRequest("/status");
        this.loading = false;

        this.statusItems = serverResponse.status;
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },

    async submit() {
      this.loading = true;
      try {
        const requestData = {
          status: this.status,
        };
        if (Array.isArray(this.invoiceId))
          requestData.invoicesIds = this.invoiceId;

        const serverResponse = Array.isArray(this.invoiceId)
          ? await this.putRequest(`repairs/status/many`, requestData)
          : await this.putRequest(
              `/repairs/${this.invoiceId}/status`,
              requestData
            );
        this.loading = false;

        if (Array.isArray(this.invoiceId))
          this.$emit("manyRepairsSaved", serverResponse.repairs);
        else this.$emit("repairSaved", serverResponse.repair);
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
