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
            <v-col cols="12" md="4">
              <v-text-field
                v-model="businessName"
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
        </v-form>
      </v-card-text>
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