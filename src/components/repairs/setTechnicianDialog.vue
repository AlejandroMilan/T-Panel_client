<template>
  <v-dialog v-model="show" persistent width="450">
    <v-card>
      <v-toolbar color="secondary" dark flat dense>
        <v-toolbar-title>Asignar técnico</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-2">
        <v-row dense>
          <v-col cols="12">
            <v-select
              v-model="technician"
              :items="technicians"
              item-value="_id"
              item-text="name"
              outlined
              dense
              label="Técnico asignado"
              hint="Aún con técnico asignado, los demás técnicos podrán ver y modificar la reparación. Este campo solo ayuda a que el técnico pueda filtrar mejor sus reparaciones"
              persistent-hint
              :disabled="loading"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <div class="d-flex">
              <v-btn
                color="secondary"
                outlined
                class="mr-2"
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
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  mixins: [serverRequestMixin],

  props: {
    show: { type: Boolean, default: false },
    invoiceId: { type: [Number, String], required: true },
  },

  data: () => ({
    loading: false,
    error: "",
    technicians: [],
    technician: "",
  }),

  computed: {
    ...mapGetters(["user"]),
  },

  mounted() {
    this.getTechnicians();
  },

  methods: {
    async getTechnicians() {
      this.loading = true;

      try {
        const serverResponse = await this.getRequest(
          `/users/byBusiness/${this.user.businessId}`,
          true,
          { role: 3 }
        );
        this.loading = false;

        this.technicians = serverResponse.users;
        if (this.technicians.length) this.technician = this.technicians[0]._id;
      } catch (error) {
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else
          this.error = "Error inesperado, favor de contactar al desarrollador";
        if (error.status >= 500) console.error(error);
      }
    },

    async submit() {
      if (!this.technicians.length) return;
      this.loading = true;

      try {
        const technicianSelected = this.technicians.find(
          (e) => e._id === this.technician
        );
        const inputData = {
          technician: this.technician,
          customLogMessage: `Le asignó esta reparación a ${technicianSelected.name}`,
        };

        const serverResponse = await this.putRequest(
          `/repairs/${this.invoiceId}`,
          inputData
        );
        this.loading = false;

        this.$emit("technicianSelected", {
          technicianSelected,
          logs: serverResponse.repair.logs,
        });
      } catch (error) {
        console.error(error);
        this.loading = false;
        if (error.data) this.error = error.data.message;
        else
          this.error = "Error inesperado, favor de contactar al desarrollador";
        if (error.status >= 500) console.error(error);
      }
    },
  },
};
</script>
