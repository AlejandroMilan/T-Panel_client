<template>
  <div>
    <hasNoBusiness v-if="!user.businessId"></hasNoBusiness>
    <v-row dense class="my-5">
      <v-col cols="12">
        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
      </v-col>
      <v-col cols="12" md="6">
        <businessData
          :loading="loading"
          :business="business"
          @businessUpdated="businessUpdated"
        ></businessData>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import hasNoBusiness from "./hasNoBusiness";
import businessData from "./businessData";

import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "businessView",

  mixins: [serverRequestMixin],

  components: {
    hasNoBusiness,
    businessData,
  },

  computed: {
    ...mapGetters(["user", "sessionToken"]),
  },

  data: () => ({
    business: null,
    loading: false,
    error: null,
  }),

  mounted() {
    if (this.business) this.getBusiness();
  },

  methods: {
    async getBusiness() {
      this.error = null;
      this.loading = true;
      try {
        const response = await this.getRequest(
          `/business/${this.user.businessId}`
        );
        this.loading = false;
        this.business = response.business;
      } catch (error) {
        this.loading = false;
        error.status < 500
          ? (this.error = error.data.message)
          : console.error(error);
      }
    },

    businessUpdated(business) {
      this.business = business;
    },
  },
};
</script>
