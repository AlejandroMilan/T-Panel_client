<template>
  <v-card color="secondary" dark flat>
    <v-card-subtitle class="pb-0 d-flex flex-wrap">
      <v-chip color="accent" small
        ><span class="secondary--text">Promesa de actualización</span></v-chip
      >
    </v-card-subtitle>
    <v-card-title class="pt-0"
      >Notificaciones de acciones en reparaciones.</v-card-title
    >
    <v-card-text
      ><v-alert type="warning">
        <span
          >Nos encontramos realizando una actualización completa en nuestro
          servidor, por lo que la promesa puede demorar más de lo
          previsto.</span
        >
      </v-alert></v-card-text
    >
  </v-card>
</template>

<script>
export default {};
</script>
