<template>
  <div class="py-2">
    <v-row
      :no-gutters="!$vuetify.breakpoint.mdAndUp"
      :dense="$vuetify.breakpoint.mdAndUp"
    >
      <v-col cols="12" md="6">
        <v-text-field
          v-model="trademark"
          label="Marca del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.trademark"
          @input="validateTrademark()"
          @blur="validateTrademark()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="model"
          label="Modelo del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.model"
          @input="validateModel()"
          @blur="validateModel()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="color"
          label="Color del dispositivo"
          outlined
          dense
          color="primary"
          :error-messages="errors.color"
          @input="validateColor()"
          @blur="validateColor()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="imei"
          label="IMEI/ESN (opcional)"
          outlined
          dense
          color="primary"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="reasonForAdmission"
          label="Motivo de ingreso (falla)"
          outlined
          dense
          color="primary"
          :error-messages="errors.reasonForAdmission"
          @input="validateReasonForAdmission()"
          @blur="validateReasonForAdmission()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-model="canStart"
          :label="`¿Puede encender?: ${canStart ? 'Sí' : 'No'}`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-model="beforeRepaired"
          :label="`¿Ya ha sido reparado?: ${beforeRepaired ? 'Sí' : 'No'}`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-model="presentsMoisture"
          :label="`¿Presenta humedad (está mojado)?: ${
            presentsMoisture ? 'Sí' : 'No'
          }`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          v-model="blocking.hasBlocking"
          :label="`¿Tiene algún método de desbloqueo?: ${
            blocking.hasBlocking ? 'Sí' : 'No'
          }`"
        ></v-checkbox>
      </v-col>
      <v-col v-if="blocking.hasBlocking" cols="12" md="6">
        <v-select
          v-model="blocking.blockingType"
          label="Tipo de desbloqueo"
          outlined
          dense
          :items="blockingTypes"
          item-text="name"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'pin'"
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="blocking.pin"
          label="PIN de desbloqueo"
          outlined
          dense
          color="primary"
          :error-messages="errors.pin"
          @input="validatePin()"
          @blur="validatePin()"
        >
        </v-text-field>
      </v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'password'"
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="blocking.password"
          label="Contraseña de desbloqueo"
          outlined
          dense
          color="primary"
          :error-messages="errors.password"
          @input="validatePassword()"
          @blur="validatePassword()"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" v-if="$vuetify.breakpoint.mdAndUp"></v-col>
      <v-col
        v-if="blocking.hasBlocking && blocking.blockingType === 'patreon'"
        cols="12"
        md="6"
      >
        <patreonCreator
          @change="updatePatreon"
          :current="
            currentDevice ? currentDevice.blocking.patreon : null
          "
        ></patreonCreator>
      </v-col>
      <v-col cols="12">
        <div class="d-flex">
          <v-btn
            color="secondary"
            outlined
            @click="$emit('cancel')"
            class="mr-2"
          >
            <v-icon small>mdi-close</v-icon>
            {{ $vuetify.breakpoint.mdAndUp ? "Cancelar" : null }}</v-btn
          >
          <v-btn color="primary" :disabled="!isFormValid" @click="validateStep">
            {{ $vuetify.breakpoint.mdAndUp ? "Siguiente" : null
            }}<v-icon small>mdi-arrow-right</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import patreonCreator from "./patreonCreator";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { _ } from "vue-underscore";

export default {
  name: "deviceDialogStep",

  mixins: [validationMixin],

  props: {
    currentDevice: { type: Object, default: null },
  },

  components: { patreonCreator },

  computed: {
    isFormValid() {
      if (this.errors.trademark.length) return false;
      if (this.errors.model.length) return false;
      if (this.errors.color.length) return false;
      if (this.errors.reasonForAdmission.length) return false;
      if (this.blocking.hasBlocking) {
        if (this.blocking.blockingType === "pin" && this.errors.pin.length)
          return false;
        if (
          this.blocking.blockingType === "password" &&
          this.errors.password.length
        )
          return false;
        if (
          this.blocking.blockingType === "patreon" &&
          !this.blocking.patreon?.length
        )
          return false;
      }
      return true;
    },
  },

  watch: {
    currentDevice() {
      this.setCurrentDevice();
    },
  },

  data: () => ({
    trademark: "",
    model: "",
    color: "",
    imei: "",
    reasonForAdmission: "",
    canStart: true,
    beforeRepaired: false,
    presentsMoisture: false,
    blocking: {
      hasBlocking: false,
      blockingType: "",
      patreon: [],
      pin: "",
      password: "",
    },
    errors: {
      trademark: [],
      model: [],
      color: [],
      reasonForAdmission: [],
      pin: [],
      password: [],
    },
    blockingTypes: [
      {
        name: "PIN",
        value: "pin",
      },
      {
        name: "Contraseña",
        value: "password",
      },
      {
        name: "Patrón de desbloqueo",
        value: "patreon",
      },
    ],
  }),

  validations: {
    trademark: { required },
    model: { required },
    color: { required },
    reasonForAdmission: { required },
    blocking: {
      pin: { required, minLength: minLength(4), maxLength: maxLength(4) },
      password: { required },
    },
  },

  created() {
    if (this.currentDevice) {
      this.setCurrentDevice();
    }
  },

  methods: {
    validateTrademark() {
      const errors = [];
      this.$v.trademark.$touch();
      !this.$v.trademark.required &&
        errors.push("La marca del dispositivo es requerida");
      this.errors.trademark = errors;
    },

    validateModel() {
      const errors = [];
      this.$v.model.$touch();
      !this.$v.model.required &&
        errors.push("El modelo del dispositivo es requerido");
      this.errors.model = errors;
    },

    validateColor() {
      const errors = [];
      this.$v.color.$touch();
      !this.$v.color.required &&
        errors.push("El color del dispositivo es requerido");
      this.errors.color = errors;
    },

    validateReasonForAdmission() {
      const errors = [];
      this.$v.reasonForAdmission.$touch();
      !this.$v.reasonForAdmission.required &&
        errors.push("El motivo de ingreso del dispositivo es requerido");
      this.errors.reasonForAdmission = errors;
    },

    validatePin() {
      const errors = [];
      this.$v.blocking.pin.$touch();
      if (this.blocking.blockingType === "pin") {
        !this.$v.blocking.pin.required &&
          errors.push("El PIN de desbloqueo es requerido");
        !this.$v.blocking.pin.minLength &&
          errors.push("El PIN debe contener 4 dígitos");
        !this.$v.blocking.pin.maxLength &&
          errors.push("El PIN debe contener 4 dígitos");
      }
      this.errors.pin = errors;
    },

    validatePassword() {
      const errors = [];
      this.$v.blocking.password.$touch();
      if (this.blocking.blockingType === "password") {
        !this.$v.blocking.password.required &&
          errors.push("La contraseña de desbloqueo es requerida");
      }
      this.errors.password = errors;
    },

    updatePatreon(patreon) {
      this.blocking.patreon = patreon;
    },

    validateStep() {
      this.validateTrademark();
      this.validateModel();
      this.validateColor();
      this.validatePin();
      this.validatePassword();
      this.validateReasonForAdmission();
      if (!this.isFormValid) return;
      const emitData = {
        trademark: this.trademark,
        model: this.model,
        color: this.color,
        reasonForAdmission: this.reasonForAdmission,
        canStart: this.canStart,
        beforeRepaired: this.beforeRepaired,
        presentsMoisture: this.presentsMoisture,
        blocking: {
          hasBlocking: false,
        },
      };
      if (this.imei) emitData.imei = this.imei;
      if (this.blocking.hasBlocking) {
        emitData.blocking = {
          hasBlocking: true,
          blockingType: this.blocking.blockingType,
        };
        if (this.blocking.blockingType === "pin")
          emitData.blocking.pin = this.blocking.pin;
        if (this.blocking.blockingType === "password")
          emitData.blocking.password = this.blocking.password;
        if (this.blocking.blockingType === "patreon")
          emitData.blocking.patreon = this.blocking.patreon;
      }

      this.$emit("stepValid", emitData);
    },

    setCurrentDevice() {
      if (this.currentDevice) {
        const keys = _.keys(this.currentDevice);
        keys.forEach((key) => {
          if (
            this[key] ||
            this[key] === null ||
            this[key] === "" ||
            this[key] === false
          )
            this[key] = this.currentDevice[key];
        });
      }
    },
  },
};
</script>
