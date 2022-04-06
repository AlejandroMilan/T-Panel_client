<template>
  <div>
    <welcome-card></welcome-card>
  </div>
</template>

<script>
import welcomeCard from "./welcomeCard.vue";

export default {
  name: "homeView",

  components: {
    "welcome-card": welcomeCard,
  },

  data: () => ({}),
};
</script>
