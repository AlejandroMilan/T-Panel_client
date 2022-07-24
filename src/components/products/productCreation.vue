<template>
  <v-dialog v-model="show" persistent width="800" scrollable>
    <v-card :loading="loading">
      <v-card-title>
        <span>{{
          currentProduct ? currentProduct.name : "Nuevo producto"
        }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col v-if="error" cols="12">
            <v-alert type="error" outlined>{{ error }}</v-alert>
          </v-col>
          <v-col cols="12">
            <v-subheader class="ma-0 pa-0">Datos del producto</v-subheader>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="name"
              outlined
              dense
              color="secondary"
              label="Nombre del producto"
              :error-messages="errors.name"
              @input="validateName()"
              @blur="validateName()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="sku"
              outlined
              dense
              color="secondary"
              label="SKU"
              :error-messages="errors.sku"
              @input="validateSku()"
              @blur="validateSku()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="unitCost"
              outlined
              dense
              color="secondary"
              label="Precio unitario"
              :error-messages="errors.unitCost"
              :hint="currencyFormat(unitCost)"
              persistent-hint
              @input="validateUnitCost()"
              @blur="validateUnitCost()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="!currentProduct" dense>
          <v-col cols="12">
            <v-subheader class="ma-0 pa-0"
              >Existencias en sucursales</v-subheader
            >
          </v-col>
          <v-col v-for="(stockItem, index) in stock" :key="index" cols="12">
            <v-row dense>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="stockItem.branchOfficeName"
                  readonly
                  color="secondary"
                  dense
                  :filled="index % 2 == 0"
                  :outlined="index % 2 != 0"
                  label="Sucursal"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="stockItem.existences"
                  color="secondary"
                  dense
                  :filled="index % 2 == 0"
                  :outlined="index % 2 != 0"
                  label="Existencias"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            class="mr-2"
            @click="$emit('cancel')"
          >
            <span>Cancelar</span>
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            :loading="loading"
            @click="submit()"
          >
            <v-icon small class="mr-2">mdi-content-save</v-icon>
            <span>Guardar</span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, numeric } from "vuelidate/lib/validators";

import serverRequestMixin from "@/mixins/serverRequest.mixin.js";
import { currencyFormat } from "@/helpers/numbers.helper.js";

export default {
  mixins: [validationMixin, serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    currentProduct: { type: Object, default: () => null },
  },

  data() {
    return {
      loading: false,
      error: "",
      name: "",
      sku: "",
      unitCost: "",
      branchOffices: [],
      stock: [
        {
          branchOffice: "",
          branchOfficeName: "",
          existences: 0,
        },
      ],
      errors: {
        name: [],
        sku: [],
        unitCost: [],
      },
      product: null,
    };
  },

  validations: {
    name: { required },
    sku: { required },
    unitCost: { required, numeric },
  },

  computed: {
    isFormValid() {
      if (this.errors.name.length) return false;
      if (this.errors.unitCost.length) return false;
      if (this.errors.sku.length) return false;
      return true;
    },
  },

  mounted() {
    if (this.currentProduct) this.setCurrentData();
    else this.getBranchOffices();
  },

  methods: {
    currencyFormat,

    setCurrentData() {
      if (this.currentProduct) {
        this.name = this.currentProduct.name;
        this.sku = this.currentProduct.sku;
        this.unitCost = this.currentProduct.unitCost;
      }
    },

    async getBranchOffices() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest("/branchOffices");
        this.loading = false;

        this.branchOffices = serverResponse.branchOffices;
        this.stock = this.branchOffices.map((e) => {
          return {
            branchOffice: e._id,
            existences: 0,
            branchOfficeName: e.name,
          };
        });
      } catch (error) {
        if (error.data) this.error = error.data.message;
        else {
          this.error = "Error inesperado, favor de contactar con soporte";
          console.error(error);
        }
      }
    },

    validateForm() {
      this.validateName();
      this.validateSku();
      this.validateUnitCost();
    },

    validateName() {
      this.$v.name.$touch();
      if (this.$v.name.required) this.errors.name = [];
      else this.errors.name.push("El nombre del producto es requerido");
    },

    validateSku() {
      this.$v.sku.$touch();
      if (this.$v.sku.required) this.errors.sku = [];
      else this.errors.sku.push("El SKU del producto es requerido");
    },

    validateUnitCost() {
      this.$v.unitCost.$touch();
      this.errors.unitCost = [
        ...(this.$v.unitCost.required
          ? []
          : ["El costo unitario es requerido"]),
        ...(this.$v.unitCost.numeric ? [] : ["Ingresa una cantidad válida"]),
      ];
    },

    async submit() {
      this.validateForm();
      if (!this.isFormValid) return;
      this.loading = true;

      try {
        const body = {
          name: this.name,
          sku: this.sku,
          unitCost: this.unitCost,
        };
        const serverResponse = this.currentProduct
          ? await this.putRequest(
              `/products/product/${this.currentProduct._id}/info`,
              body
            )
          : await this.postRequest("/products", body);
        this.loading = false;

        this.product = serverResponse.product;
        if (this.currentProduct) this.$emit("productSaved", this.product);
        else this.submitBranchOfficesExistences();
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else {
          this.error = "Error inesperado, favor de contactar con soporte";
          console.error(error);
        }
      }
    },

    async submitBranchOfficesExistences() {
      this.loading = true;

      try {
        for (let stockItem of this.stock) {
          const body = {
            branchOffice: stockItem.branchOffice,
            existences: stockItem.existences || 0,
          };
          const serverResponse = await this.putRequest(
            `/products/product/${this.product._id}/stock`,
            body
          );
          this.product = serverResponse.product;
        }

        this.loading = false;
        this.$emit("productSaved", this.product);
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else {
          this.error = "Error inesperado, favor de contactar con soporte";
          console.error(error);
        }
      }
    },
  },
};
</script>
