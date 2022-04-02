<template>
  <v-dialog persistent v-model="show" width="400">
    <v-card :loading="loading">
      <v-card-title>Añadir término</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-textarea
              v-model="newTerm"
              filled
              color="secondary"
              label="Nuevo término"
              @input="validateNewTerm"
              @blur="validateNewTerm"
              :error-messages="errors.newTerm"
              :disabled="loading"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          outlined
          @click="$emit('cancel')"
          :disabled="loading"
          >Cancelar</v-btn
        >
        <v-btn
          color="primary"
          :disabled="!isFormValid || loading"
          @click="submit"
          :loading="loading"
        >
          <v-icon small class="mr-2" color="secondary">mdi-content-save</v-icon>
          <span class="text--secondary">Guardar término</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "addBusinessTerm",

  mixins: [serverRequestMixin, validationMixin],

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    currentTerms: {
      type: Array,
      required: true,
    },

    businessId: {
      type: String,
      required: true,
    },
  },

  computed: {
    isFormValid() {
      if (this.errors.newTerm.length) return false;
      return true;
    },
  },

  data: () => ({
    loading: false,
    error: null,
    newTerm: "",
    errors: {
      newTerm: [],
    },
  }),

  validations: {
    newTerm: { required },
  },

  methods: {
    validateNewTerm() {
      const errors = [];
      this.$v.newTerm.$touch();
      !this.$v.newTerm.required && errors.push("El nuevo término es requerido");
      this.errors.newTerm = errors;
    },

    async submit() {
      this.validateNewTerm();
      if (!this.isFormValid) return;
      this.loading = true;
      try {
        const query = { newTerms: [...this.currentTerms, this.newTerm] };
        const serverResponse = await this.putRequest(
          `/business/${this.businessId}/terms`,
          query
        );
        this.loading = false;

        this.$emit(
          "termsUpdated",
          serverResponse.businessUpdated.termsAndConditions
        );
      } catch (error) {
        this.loading = false;
        if (error.data.message) this.error = error.data.message;
        else console.error(error);
      }
    },
  },
};
</script>
