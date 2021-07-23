<template>
  <v-card outlined :loading="loading">
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
      <v-list>
        <v-list-item v-for="(term, index) in termsLocal" :key="index">
          <v-list-item-content>
            <v-list-item-subtitle>{{ term }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon :disabled="loading">
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
export default {
  name: "businessTerms",

  props: {
    terms: {
      type: Array,
      default: () => [],
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
  },

  data: () => ({
    termsLocal: [],
  }),

  mounted() {
    this.termsLocal = this.terms;
  },
};
</script>
