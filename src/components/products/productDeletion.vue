<template>
  <v-dialog v-model="show" persistent width="400">
    <v-card :loading="loading">
      <v-card-title>
        <span>Confirmar</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <span
          >¿Estás segur@ que deseas eliminar este producto? Toma en cuenta lo
          siguiente</span
        >
        <ul class="py-2">
          <li v-for="(consideration, index) in considerations" :key="index">
            {{ consideration }}
          </li>
        </ul>
        <div class="d-flex justify-end pt-2">
          <v-btn
            color="secondary"
            outlined
            class="mr-2"
            @click="$emit('cancel')"
          >
            <span>No, cancelar</span>
          </v-btn>
          <v-btn color="error" :loading="loading" @click="deleteProduct()">
            <v-icon small class="mr-2">mdi-delete</v-icon>
            <span>Sí, eliminar</span>
          </v-btn>
        </div>
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
    productId: { type: String, required: true },
  },

  data: () => ({
    loading: false,
    error: "",
    considerations: [
      "El producto no será visible en los próximos reportes de ventas",
      "No se econtrará ninguna información relacionada con él",
    ],
  }),

  methods: {
    async deleteProduct() {
      this.loading = true;
      this.error = "";

      try {
        await this.deleteRequest(`/products/product/${this.productId}`);
        this.loading = false;

        this.$emit("productDeleted", this.productId);
      } catch (error) {
        this.handleResponseError(error);
      }
    },
  },
};
</script>
