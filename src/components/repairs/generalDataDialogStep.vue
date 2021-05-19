<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="10" md="11">
        <v-text-field
          v-model="invoiceId"
          label="Número de folio"
          outlined
          dense
          color="primary"
          :error-messages="errors.invoiceId"
          @input="validateInvoiceId()"
          @blur="validateInvoiceId()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2" md="1">
        <div class="d-flex justify-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon color="primary" v-bind="attrs" v-on="on"
                ><v-icon>mdi-autorenew</v-icon></v-btn
              >
            </template>
            <span>Generar folio automáticamente</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="invoiceId"
          label="Costo estimado (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.invoiceId"
          @input="validateInvoiceId()"
          @blur="validateInvoiceId()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="invoiceId"
          label="Adelanto del cliente (opcional)"
          outlined
          dense
          color="primary"
          :error-messages="errors.invoiceId"
          @input="validateInvoiceId()"
          @blur="validateInvoiceId()"
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
            >Paso anterior</v-btn
          >
          <v-btn color="primary">Guardar reparación</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "generalDataDialogStep",

  data: () => ({
    invoiceId: "",
    errors: {
      invoiceId: [],
    },
  }),

  methods: {
    validateInvoiceId() {
      console.log(this.invoiceId);
    },
  },
};
</script>
