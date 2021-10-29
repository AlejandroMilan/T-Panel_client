<template>
  <v-dialog v-model="show" persistent max-width="750px">
    <v-card>
      <v-card-title>
        <span>Realizar una donación al proyecto</span>
        <v-spacer></v-spacer>
        <v-btn v-if="$vuetify.breakpoint.mdAndUp" icon @click="$emit('cancel')"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text>
        <div class="mt-2">
          <span
            >T-Panel es una aplicación <strong>100% gratuita</strong> utilizada
            actualmente por cerca de 100 establecimientos. En Dev Tek
            agredecemos tu preferencia, con el tiempo esta será la aplicación
            definitiva para negocios dedicados al servicio técnico.</span
          >
        </div>
        <div class="mt-2">
          <span>
            Sin embargo, a nosotros nos cuesta mantener esta aplicación.
            Nuestros principales gastos son: servidores y servicios de
            almacenamiento en la nube.
          </span>
        </div>
        <div class="mt-2">
          <span>
            Si te gustaría apoyar al crecimiento de esta aplicación, puedes
            apoyar donando de forma recurrente al proyecto la cantidad que esté
            dentro de tus posibilidades. No hay un mínimo que puedas aportar y
            cualquier ayuda es bastante buena para mantener esta plataforma en
            pie.
          </span>
        </div>
        <v-alert type="success" class="mt-2"
          >Muchas gracias de antemano si es que decides aportar, si no está en
          tus posibilidades el aportar dinero no hay ningún problema ¡Te
          agradecemos por usar T-Panel!</v-alert
        >
      </v-card-text>
      <v-card-actions>
        <v-container class="justify-end">
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            color="secondary"
            outlined
            @click="$emit('cancel')"
            :class="{
              'mb-2': !$vuetify.breakpoint.mdAndUp,
              'mr-2': $vuetify.breakpoint.mdAndUp,
            }"
            >Cancelar</v-btn
          >
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            color="primary"
            href="https://www.paypal.com/paypalme/devtekmx"
            target="_blank"
          >
            <span>Donar vía PayPal</span>
            <v-icon small>mdi-arrow-top-right-thick</v-icon>
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "donationDialog",

  props: {
    show: { type: Boolean, default: false },
  },
};
</script>
