<template>
  <v-card outlined :loading="loadingLocal">
    <v-card-title class="d-fex justify-space-between align-center">
      <span style="max-width: 75%">Términos y condiciones de servicio</span>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon :disabled="loading">
            <v-icon class="mr-2" v-bind="attrs" v-on="on">
              mdi-plus-circle
            </v-icon>
          </v-btn>
        </template>
        <span>Añadir condición</span>
      </v-tooltip>
    </v-card-title>
    <v-card-subtitle
      >Aquí puedes expresar cualquier tipo de condición de servicio que tus
      clientes aceptan al solicitar una reparación en tu negocio, estos datos se
      mostrarán en la nota a entregar a tu cliente. Algunos ejemplos de
      condiciones de servicio pueden ser: límite de garantías, tiempo máximo del
      que dispone el cliente para recoger su dispositivo, cambios en costos,
      etc...</v-card-subtitle
    >
    <v-card-text>
      <v-alert text outlined type="error" v-if="error">{{ error }}</v-alert>
      <v-alert v-if="!error && !termsLocal.length" text outlined type="info"
        >Aún no has registrado términos y condiciones de tu servicio, da click
        en el botón <v-icon small color="info">mdi-plus-circle</v-icon> para
        comenzar a agregar.</v-alert
      >
      <v-list>
        <v-list-item v-for="(term, index) in termsLocal" :key="index">
          <v-list-item-content>
            <v-list-item-subtitle>{{ term }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon :disabled="loading" @click="deleteCondition(index)">
                  <v-icon class="mr-2" v-bind="attrs" v-on="on">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "businessTerms",

  mixins: [serverRequestMixin],

  props: {
    terms: {
      type: Array,
      default: () => [],
    },

    businessId: {
      type: String,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    terms() {
      this.termsLocal = this.terms;
    },

    loading() {
      this.loadingLocal = this.loading;
    },
  },

  data: () => ({
    termsLocal: [],
    loadingLocal: false,
    error: null,
  }),

  mounted() {
    this.termsLocal = this.terms;
    this.loadingLocal = this.loading;
  },

  methods: {
    async deleteCondition(indexToDelete) {
      this.error = null;
      try {
        this.loadingLocal = true;
        const newTerms = this.termsLocal.filter(
          (term, index) => index !== indexToDelete
        );

        const serverResponse = await this.putRequest(
          `/business/${this.businessId}/terms`,
          { newTerms }
        );
        this.loadingLocal = false;

        this.termsLocal = serverResponse.businessUpdated.termsAndConditions;
      } catch (error) {
        this.loadingLocal = false;
        this.error = error.data.message;
        if (error.response.status >= 500) console.error(error.response);
      }
    },
  },
};
</script>
