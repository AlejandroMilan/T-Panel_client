<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card :loading="loading">
      <v-card-title>
        <span>Modificación de existencias</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col v-if="error" cols="12">
            <v-alert type="error">{{ error }}</v-alert>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="stockItemLocal.branchOffice.name"
              readonly
              outlined
              dense
              label="Sucursal"
              color="secondary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="stockItemLocal.existences"
              outlined
              dense
              label="Existencias"
              color="secondary"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="secondary"
              outlined
              class="mr-2"
              @click="$emit('cancel')"
            >
              <span>Cancelar</span>
            </v-btn>
            <v-btn color="primary" :loading="loading" @click="submit()">
              <v-icon small class="mr-2">mdi-content-save</v-icon>
              <span>Guardar</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin.js";

export default {
  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    stockItem: { type: Object, required: true },
    productId: { type: String, required: true },
  },

  data() {
    return {
      loading: false,
      error: "",
      stockItemLocal: this.stockItem,
    };
  },

  methods: {
    async submit() {
      this.loading = true;
      this.error = "";

      try {
        const body = {
          existences: this.stockItemLocal.existences,
        };
        await this.putRequest(
          `/products/product/${this.productId}/branchOffice/${this.stockItemLocal.branchOffice._id}/existences`,
          body
        );

        this.loading = false;
        this.$emit("cancel");
      } catch (error) {
        this.handleResponseError(error);
      }
    },
  },
};
</script>
