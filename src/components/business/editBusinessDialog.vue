<template>
  <v-dialog
    v-if="show"
    persistent
    v-model="show"
    :fullscreen="!$vuetify.breakpoint.mdAndUp"
    :width="$vuetify.breakpoint.mdAndUp ? '600' : null"
  >
    <v-card>
      <v-card-title> Editar datos del negocio </v-card-title>
      <v-card-text>
        <v-form>
          <v-subheader>Datos generales</v-subheader>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Nombre del negocio"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-subheader>Datos de contacto</v-subheader>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Correo electrónico"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Número telefónico"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Sitio web"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-subheader>Datos de domicilio</v-subheader>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="name"
                label="Calle"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="name"
                label="Núm. Exterior"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="name"
                label="Núm. Interior"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Colonia"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Ciudad"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Estado"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="País"
                outlined
                dense
                color="primary"
                :disabled="loading"
                :error-messages="errors.name"
                @input="validateName()"
                @blur="validateName()"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" outlined @click="$emit('cancel')"
          >Cancelar</v-btn
        >
        <v-btn color="primary">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "editBusinessDialog",

  props: {
    show: { type: Boolean, default: false },
    business: { type: Object, default: null },
  },

  data: () => ({
    loading: false,
    name: "",
    email: "",
    phoneNumber: "",
    website: "",
    street: "",
    extNumber: "",
    intNumber: "",
    county: "",
    city: "",
    state: "",
    country: "",
    errors: {
      name: [],
      email: [],
      phoneNumber: [],
      website: [],
      street: [],
      extNumber: [],
      intNumber: [],
      county: [],
      city: [],
      state: [],
      country: [],
    },
  }),

  methods: {
    validateName() {
      console.log("Validado");
    },
  },
};
</script>

<style lang="scss" scoped>
.v-subheader {
  padding: 0;
}
</style>
