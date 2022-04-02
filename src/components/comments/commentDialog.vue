<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card :loading="loading">
      <v-card-title>Agregar comentario</v-card-title>
      <v-card-text>
        <v-alert type="error" v-if="submitError" outlined>{{
          submitError
        }}</v-alert>
        <v-textarea
          filled
          v-model="comment"
          rows="4"
          label="Comentario"
          color="secondary"
          :error-messages="errors.comment"
          @input="validateComment"
          @blur="validateComment"
        ></v-textarea>
        <v-form v-model="isImageValid" ref="imageForm" lazy-validation>
          <v-file-input
            v-model="imageFile"
            :label="
              loading ? 'Subiendo imagen...' : 'Agregar imagen (opcional)'
            "
            filled
            color="secondary"
            prepend-inner-icon="mdi-camera"
            :disabled="loading"
            :prepend-icon="null"
            :accept="accept.join(',')"
            :rules="imageRules"
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          outlined
          :disabled="loading"
          @click="$emit('cancel')"
        >
          <v-icon small class="mr-2">mdi-close</v-icon>
          <span>Cancelar</span>
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading || !isFormValid"
          @click="submit"
        >
          <v-icon small class="mr-2" color="secondary">mdi-content-save</v-icon>
          <span class="secondary--text">Guardar</span>
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
  name: "commentDialog",

  mixins: [validationMixin, serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    invoiceId: { type: [String, Number], required: true },
  },

  computed: {
    isFormValid() {
      if (this.errors.comment.length) return false;
      return true;
    },
  },

  data: () => ({
    loading: false,
    comment: "",
    submitError: "",
    errors: {
      comment: [],
    },
    isImageValid: false,
    imageFile: null,
    imageRules: [
      (image) =>
        !image ||
        image.size < 1 * 1024 * 1024 ||
        "El archivo de imagen no puede exceder 1Mb",
      (image) =>
        !image ||
        ["image/png", "image/jpeg", "image/jpg"].indexOf(image.type) != -1 ||
        "Tipo de archivo inválido, tipos aceptados: jpeg, jpg, png",
    ],
    accept: [".png", ".jpg", ".jpeg"],
  }),

  validations: {
    comment: { required },
  },

  methods: {
    validateComment() {
      let errors = [];
      this.$v.comment.$touch();
      !this.$v.comment.required && errors.push("El comentario es requerido");
      this.errors.comment = errors;
    },

    async submit() {
      this.submitError = "";
      this.validateComment();
      if (!this.isFormValid || !this.$refs.imageForm.validate()) return;

      this.loading = true;

      try {
        let serverResponse = await this.postRequest("/comments", {
          invoiceId: this.invoiceId,
          content: this.comment,
        });

        if (this.imageFile) {
          const fileToUpload = new FormData();
          fileToUpload.append("file", this.imageFile);

          serverResponse = await this.postRequest(
            `/comments/${serverResponse.comment._id}/files`,
            fileToUpload
          );
        }

        this.loading = false;

        this.$emit("commentSaved", serverResponse.comment);
      } catch (error) {
        this.loading = false;
        this.submitError = error.data.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
