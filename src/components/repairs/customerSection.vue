<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-divider class="mt-3"></v-divider>
        <v-subheader>Cliente</v-subheader>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Nombre</v-list-item-subtitle>
            <v-list-item-title>{{ customerData.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6" v-if="customerData.phoneNumber">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Número telefónico</v-list-item-subtitle>
            <v-list-item-title>{{
              customerData.phoneNumber
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6" v-if="customerData.email">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Correo electrónico</v-list-item-subtitle>
            <v-list-item-title>{{ customerData.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6" v-if="customerData.adress">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Dirección</v-list-item-subtitle>
            <v-list-item-title>{{ customerData.adress }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "customerSection",

  props: {
    customerData: { type: Object, required: true },
  },
};
</script>
