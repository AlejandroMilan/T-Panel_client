<template>
  <v-dialog v-model="show" persistent width="400">
    <v-card>
      <v-card-title>¿Estás seguro de eliminar esta sucursal?</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" outlined>{{ error }}</v-alert>
        <span
          >Se eliminarán todas las reparaciones y usuarios en ella. Esta acción
          no se puede revertir</span
        ></v-card-text
      >
      <v-card-actions>
        <v-btn
          color="secondary"
          outlined
          :disabled="loading"
          :loading="loading"
          @click="$emit('cancel')"
          >No, cancelar</v-btn
        >
        <v-btn
          color="error"
          :disabled="loading"
          :loading="loading"
          @click="deleteBranch"
        >
          <v-icon small>mdi-delete</v-icon>
          <span>Sí, eliminar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "deleteBranchOfficeDialog",

  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    branchId: { type: String, required: true },
  },

  data: () => ({
    loading: false,
    error: null,
  }),

  methods: {
    async deleteBranch() {
      this.loading = true;
      try {
        const serverResponse = await this.deleteRequest(
          `/branchOffices/${this.branchId}`
        );
        this.loading = false;

        this.$emit("branchDeleted", serverResponse.branchOfficeDeleted._id);
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
