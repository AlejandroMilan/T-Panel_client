<template>
  <v-dialog v-model="show" width="400" persistent>
    <v-card :loading="loading">
      <v-card-title
        ><span>{{
          Array.isArray(invoiceId)
            ? "¿Está seguro que desea eliminar las reparaciones?"
            : "¿Está seguro que desea eliminar la reparación?"
        }}</span></v-card-title
      >
      <v-card-text>
        <span>
          {{
            Array.isArray(invoiceId)
              ? "Una vez eliminada, no se puede recuperar ningún dato de ellas."
              : "Una vez eliminada, no se puede recuperar ningún dato de ella."
          }}
        </span>
        <v-alert type="error" outlined class="mt-2" v-if="error">{{
          error
        }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          :disabled="loading"
          outlined
          @click="$emit('cancel')"
          >No, cancelar</v-btn
        >
        <v-btn
          color="error"
          :disabled="loading"
          :loading="loading"
          @click="deleteRepair"
        >
          <v-icon small>mdi-delete</v-icon>
          Sí, eliminar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "deleteRepairDialog",

  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, defualt: false },
    invoiceId: { type: [Number, Array], required: true },
    deleteQueryString: { type: String, default: "" },
  },

  data: () => ({
    loading: false,
    error: null,
  }),

  methods: {
    async deleteRepair() {
      this.loading = true;
      try {
        const serverResponse = Array.isArray(this.invoiceId)
          ? await this.deleteRequest(
              `/repairs/delete/many${this.deleteQueryString}`
            )
          : await this.deleteRequest(`/repairs/${this.invoiceId}`);
        this.loading = false;

        if (Array.isArray(this.invoiceId))
          this.$emit("manyRepairsDeleted", serverResponse.repairs);
        else this.$emit("repairDeleted", serverResponse.repairDeleted);
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
