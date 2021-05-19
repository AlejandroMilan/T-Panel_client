<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="12" md="6">
        <v-text-field
          v-model="name"
          label="Nombre del cliente"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="name"
          label="Número telefónico (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="name"
          label="Correo electrónico (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="name"
          label="Dirección (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <div class="d-flex">
          <v-btn
            color="secondary"
            outlined
            @click="$emit('cancel')"
            class="mr-2"
            >Cancelar</v-btn
          >
          <v-btn color="primary" :disabled="!isFormValid" @click="validateStep"
            >Siguiente</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "customerDialogStep",

  computed: {
    isFormValid() {
      return true;
    },
  },

  data: () => ({
    name: "",
    errors: {
      name: [],
    },
  }),

  methods: {
    validateName() {
      console.log("nombre");
    },

    validateStep() {
      console.log("Valido");
    },
  },
};
</script>