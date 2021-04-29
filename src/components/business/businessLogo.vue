<template>
  <v-card outlined :loading="loading">
    <v-card-title>
      <span> Logo del negocio </span>
    </v-card-title>
    <v-card-text>
      <v-img
        src="https://assets.turbologo.com/blog/fr/2018/11/19134521/vintage-logo-958x575.jpg"
      ></v-img>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "businessLogo",

  data: () => ({
    loading: false,
  }),
};
</script>