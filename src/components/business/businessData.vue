<template>
  <v-card outlined>
    <v-card-title>
      <span class="headline">Datos del negocio</span>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="editBusiness = true">mdi-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <div v-for="(section, index) in sections" :key="index">
      <v-subheader>
        <v-icon color="primary" class="mr-2" small>{{
          section.sectionIcon
        }}</v-icon>
        {{ section.sectionName }}</v-subheader
      >
      <v-row dense>
        <v-col
          cols="12"
          md="6"
          v-for="(field, index) in section.fields"
          :key="index"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ field.fieldName }}</v-list-item-title>
              <v-list-item-subtitle>{{
                field.fieldValue
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </div>
    <editBusinessDialog
      :show="editBusiness"
      @cancel="editBusiness = false"
    ></editBusinessDialog>
  </v-card>
</template>

<script>
import editBusinessDialog from "./editBusinessDialog";

export default {
  name: "businessData",

  components: {
    editBusinessDialog,
  },

  props: {
    business: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    editBusiness: false,
    sections: {
      generalData: {
        sectionName: "Datos generales",
        sectionIcon: "mdi-information",
        fields: [],
      },
      contactData: {
        sectionName: "Datos de contacto",
        sectionIcon: "mdi-message",
        fields: [],
      },
      adressData: {
        sectionName: "Domicilio",
        sectionIcon: "mdi-map",
        fields: [],
      },
    },
  }),

  mounted() {
    this.setSections();
  },

  methods: {
    setSections() {
      const noFieldString = "Sin registrar";

      this.sections.generalData.fields = [
        {
          fieldName: "Nombre del negocio",
          fieldValue: this.business ? this.business.name : noFieldString,
        },
      ];

      this.sections.contactData.fields = [
        {
          fieldName: "Correo electrónico",
          fieldValue: this.business ? this.business.email : noFieldString,
        },
        {
          fieldName: "Número telefónico",
          fieldValue: this.business ? this.business.phoneNumber : noFieldString,
        },
        {
          fieldName: "Sitio web",
          fieldValue: this.business ? this.business.website : noFieldString,
        },
      ];

      this.sections.adressData.fields = [
        {
          fieldName: "Calle",
          fieldValue: this.business
            ? this.business.adress.street
            : noFieldString,
        },
        {
          fieldName: "Número exterior",
          fieldValue: this.business
            ? this.business.adress.extNumber
            : noFieldString,
        },
        {
          fieldName: "Número interior",
          fieldValue: this.business
            ? this.business.adress.intNumber
            : noFieldString,
        },
        {
          fieldName: "Colonia",
          fieldValue: this.business
            ? this.business.adress.county
            : noFieldString,
        },
        {
          fieldName: "Ciudad",
          fieldValue: this.business ? this.business.adress.city : noFieldString,
        },
        {
          fieldName: "Estado",
          fieldValue: this.business
            ? this.business.adress.state
            : noFieldString,
        },
        {
          fieldName: "País",
          fieldValue: this.business
            ? this.business.adress.country
            : noFieldString,
        },
      ];
    },
  },
};
</script>
