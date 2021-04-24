<template>
  <v-card>
    <div v-for="(section, index) in sections" :key="index">
      <v-subheader>{{ section.sectionName }}</v-subheader>
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
  </v-card>
</template>

<script>
export default {
  name: "businessData",

  data: () => ({
    sections: {
      generalData: {
        sectionName: "Datos generales",
        fields: [],
      },
      contactData: {
        sectionName: "Datos de contacto",
        fields: [],
      },
      adressData: {
        sectionName: "Domicilio",
        fields: [],
      },
    },
  }),
};
</script>