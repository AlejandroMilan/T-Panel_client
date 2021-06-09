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
          >Cancelar</v-btn
        >
        <v-btn color="primary" :disabled="loading" @click="submit"
          >Guardar</v-btn
        >
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
    invoiceId: { type: Number, required: true },
  },

  data: () => ({
    loading: false,
    error: "",
    statusItems: [],
    status: "",
  }),

  mounted() {
    this.getStatusList();
  },

  methods: {
    async getStatusList() {
      this.loading = true;
      try {
        const serverResponse = await this.getRequest("/status");
        this.loading = false;

        this.statusItems = serverResponse.status;
        this.status = this.statusItems[0].key;
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

        const serverResponse = await this.putRequest(
          `/repairs/${this.invoiceId}`,
          requestData
        );

        this.$emit("repairSaved", serverResponse.repair);
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
