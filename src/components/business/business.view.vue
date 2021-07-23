<template>
  <div>
    <hasNoBusiness v-if="!user.businessId && !business"></hasNoBusiness>
    <v-row :class="{ 'my-5': !user.businessId && !business }">
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
      <v-col cols="12" md="6">
        <businessLogo
          v-if="business"
          :logoUrl="business.logoUrl"
        ></businessLogo>
      </v-col>
      <v-col cols="12">
        <businessTerms
          :terms="business ? business.termsAndConditions : []"
          :businessId="user.businessId"
          :loading="loading"
        ></businessTerms>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import hasNoBusiness from "./hasNoBusiness";
import businessData from "./businessData";
import businessLogo from "./businessLogo";
import businessTerms from "./businessTerms";

import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "businessView",

  mixins: [serverRequestMixin],

  components: {
    hasNoBusiness,
    businessData,
    businessLogo,
    businessTerms,
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
    if (this.user.businessId) this.getBusiness();
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
