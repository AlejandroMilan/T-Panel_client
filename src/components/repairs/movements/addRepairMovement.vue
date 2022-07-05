<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card :loading="loading">
      <v-card-title>
        <span>Nuevo movimiento</span>
        <v-spacer></v-spacer>
        <v-btn icon :disabled="loading" @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="type"
              :items="typeItems"
              label="Tipo de movimiento"
              item-text="text"
              item-value="value"
              color="secondary"
              item-color="secondary"
              outlined
              dense
            >
              <template #prepend-inner>
                <v-icon v-if="type === 'bill'" color="red"
                  >mdi-arrow-down</v-icon
                >
                <v-icon v-else color="green">mdi-arrow-up</v-icon>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="amount"
              :error-messages="errors.amount"
              label="Monto"
              outlined
              dense
              color="secondary"
              prepend-inner-icon="mdi-currency-usd"
              :hint="currencyFormat(amount)"
              persistent-hint
              @input="validateAmount()"
              @blur="validateAmount()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="description"
              :placeholder="descriptionPlaceholder"
              :error-messages="errors.description"
              outlined
              dense
              color="secondary"
              label="Descripción breve"
              @input="validateDescription()"
              @blur="validateDescription()"
              @keyup.enter="submit()"
            ></v-text-field>
          </v-col>
          <v-col v-if="hasPermission(322)" cols="12">
            <v-checkbox
              v-model="printTicket"
              label="Imprimir ticket"
              class="ma-0"
            ></v-checkbox>
          </v-col>
          <v-col cols="12">
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                outlined
                class="mr-2"
                :disabled="loading"
                @click="$emit('cancel')"
              >
                <v-icon small class="mr-2">mdi-close</v-icon>
                <span>Cancelar</span>
              </v-btn>
              <v-btn color="primary" :loading="loading" @click="submit()">
                <v-icon small class="mr-2">mdi-content-save</v-icon>
                <span>Guardar</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import serverRequestMixin from "@/mixins/serverRequest.mixin";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import { currencyFormat } from "@/helpers/numbers.helper";

export default {
  mixins: [serverRequestMixin, validationMixin],
  props: {
    show: { type: Boolean, default: false },
  },

  data: () => ({
    loading: false,
    printTicket: false,
    error: "",
    type: "bill",
    description: "",
    amount: "",
    typeItems: [
      {
        value: "bill",
        text: "Gasto",
      },
      {
        value: "entry",
        text: "Ingreso",
      },
    ],
    errors: {
      amount: [],
      description: [],
    },
  }),

  validations: {
    amount: { required, numeric, minValue: minValue(0) },
    description: { required },
  },

  computed: {
    ...mapGetters(["hasPermission"]),

    descriptionPlaceholder() {
      return this.type === "bill"
        ? "Ej. Display nuevo"
        : "Ej. Abono del cliente";
    },

    isFormValid() {
      if (this.errors.amount.length) return false;
      if (this.errors.description.length) return false;
      return true;
    },
  },

  methods: {
    currencyFormat,

    validateForm() {
      this.validateAmount();
      this.validateDescription();
    },

    validateAmount() {
      this.$v.amount.$touch();
      this.errors.amount = [
        ...(this.$v.amount.required ? [] : ["La cantidad es requerida"]),
        ...(this.$v.amount.numeric ? [] : ["Ingresa una cantidad válida"]),
        ...(this.$v.amount.minValue ? [] : ["Ingresa una cantidad válida"]),
      ];
    },

    validateDescription() {
      this.$v.description.$touch();
      this.errors.description = [
        ...(this.$v.description.required
          ? []
          : ["La descripción es requerida"]),
      ];
    },

    async submit() {
      this.validateForm();
      if (!this.isFormValid) return;

      this.loading = true;
      this.error = "";

      try {
        const body = {
          description: this.description,
          type: this.type,
          amount: this.amount,
          invoiceId: this.$route.params.repairId,
        };

        const serverResponse = await this.postRequest("/repairMovements", body);
        if (this.printTicket) await this.doPrintTicket(serverResponse.movement);
        this.loading = false;

        this.$emit("movementSaved", serverResponse.movement);
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else {
          this.error = "Error inesperado, favor de contactar con soporte";
          console.error(error);
        }
      }
    },

    async doPrintTicket(movement) {
      this.loading = true;
      this.error = null;

      try {
        let urlString = `/repairMovements/${movement._id}/ticket`;

        const serverResponse = await this.getFileRequest(urlString);
        this.loading = false;

        var file = new Blob([serverResponse.file], { type: "application/pdf" });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      } catch (error) {
        this.loadingPrint = false;
        if (error.data) this.error = error.data.message;
        else this.error = error.message;
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
