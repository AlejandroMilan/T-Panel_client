<template>
  <div>
    <hasNoBusiness></hasNoBusiness>
    <v-row dense class="my-5">
      <v-col cols="12" md="6">
        <businessData></businessData>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import hasNoBusiness from "./hasNoBusiness";
import businessData from "./businessData";

export default {
  name: "businessView",

  components: {
    hasNoBusiness,
    businessData,
  },
};
</script>
