<template>
  <div>
    <v-card outlined :loading="loading" height="100%">
      <v-card-title>
        <span> Logo del negocio </span>
      </v-card-title>
      <v-card-text>
        <v-img :src="imageSrc"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-row dense>
          <v-col
            cols="12"
            v-if="
              user.role.role === 0 ||
              user.permissions.filter((e) => e.key === 230).length > 0
            "
          >
            <v-form v-model="isImageValid" ref="imageForm" lazy-validation>
              <v-file-input
                v-model="imageFile"
                :label="loading ? 'Subiendo imagen...' : 'Seleccionar logo'"
                filled
                prepend-inner-icon="mdi-camera"
                :disabled="loading"
                :prepend-icon="null"
                :accept="accept.join(',')"
                :rules="imageRules"
                @change="fileSelected($event)"
              ></v-file-input>
            </v-form>
            <v-alert v-if="error" type="error" dense outlined>{{
              error
            }}</v-alert>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="imageChangedDialog" width="400">
      <v-card>
        <v-card-title>Imagen actualizada</v-card-title>
        <v-card-text>
          El logo del negocio se ha actualizado, los cambios pueden tardar en
          reflejarse.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="imageChangedDialog = false"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import { mapGetters } from "vuex";

export default {
  name: "businessLogo",

  props: {
    logoUrl: {
      type: String,
      default: null,
    },
  },

  mixins: [serverRequestMixin],

  computed: { ...mapGetters(["user"]) },

  data: () => ({
    loading: false,
    isImageValid: false,
    imageChangedDialog: false,
    imageFile: null,
    error: null,
    imageSrc: "",
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

  mounted() {
    this.imageSrc = this.logoUrl;
  },

  methods: {
    async fileSelected(e) {
      try {
        if (this.$refs.imageForm.validate() && e) {
          this.error = null;
          this.loading = true;

          const fileToUpload = new FormData();
          fileToUpload.append("file", this.imageFile);

          const response = await this.putRequest(
            `/business/${this.user.businessId}/logo`,
            fileToUpload
          );

          this.imageSrc = response.businessUpdated.logoUrl;

          this.imageChangedDialog = true;
          this.loading = false;
          this.imageFile = null;
        }
      } catch (error) {
        this.loading = false;
        error.status < 500
          ? (this.error = error.data.message)
          : console.error(error);
      }
    },
  },
};
</script>
