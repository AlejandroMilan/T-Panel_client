<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="12" md="6">
        <v-text-field
          v-model="name"
          label="Nombre del cliente del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.name"
          @input="validateName()"
          @blur="validateName()"
        >
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "customerDialogStep",

  data: () => ({
    name: "",
    errors: {
      name: [],
    },
  }),
};
</script>