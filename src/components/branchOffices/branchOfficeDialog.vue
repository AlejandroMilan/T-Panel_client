<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <v-card-title>Nueva sucursal</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" v-if="error" class="my-5">
            <v-alert type="error" dense outlined>{{ error }}</v-alert>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="name"
              :error-messages="errors.name"
              label="Nombre de la sucursal"
              outlined
              @input="validateName()"
              @blur="validateName()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="adress"
              label="Dirección de la sucursal (opcional)"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          outlined
          @click="$emit('cancel')"
          :loading="loading"
          :disabled="loading"
          >Cancelar</v-btn
        >
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading || !isFormValid"
          @click="submit"
        >
          <v-icon small>mdi-content-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "branchOfficeDialog",

  mixins: [validationMixin, serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    current: { type: Object, default: null },
  },

  computed: {
    isFormValid() {
      if (this.errors.name.length > 0) return false;
      return true;
    },
  },

  data: () => ({
    loading: false,
    name: "",
    adress: "",
    error: null,
    errors: {
      name: [],
    },
  }),

  validations: {
    name: { required },
  },

  mounted() {
    if (this.current) {
      this.name = this.current.name;
      if (this.current.adress) this.adress = this.current.adress;
    }
  },

  methods: {
    validateName() {
      const errors = [];
      this.$v.name.$touch();
      !this.$v.name.required &&
        errors.push("El nombre de sucursal es requerido");
      this.errors.name = errors;
    },

    async submit() {
      this.error = null;
      this.validateName();
      if (!this.isFormValid) return;

      this.loading = true;
      try {
        const requestData = {
          name: this.name,
        };
        if (this.adress) requestData.adress = this.adress;

        const serverResponse = this.current
          ? await this.putRequest(
              `/branchOffices/${this.current._id}`,
              requestData
            )
          : await this.postRequest("/branchOffices", requestData);

        this.$emit("branchSaved", serverResponse.branchOffice);
      } catch (error) {
        this.loading = false;
        this.error = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
