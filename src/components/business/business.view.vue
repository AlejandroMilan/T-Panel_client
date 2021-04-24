<template>
  <div>
    <hasNoBusiness v-if="!user.businessId"></hasNoBusiness>
    <v-row dense class="my-5">
      <v-col cols="12" md="6">
        <businessData :business="business"></businessData>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import hasNoBusiness from "./hasNoBusiness";
import businessData from "./businessData";

export default {
  name: "businessView",

  components: {
    hasNoBusiness,
    businessData,
  },

  computed: {
    ...mapGetters(["user"]),
  },

  data: () => ({
    business: null,
  }),
};
</script>
