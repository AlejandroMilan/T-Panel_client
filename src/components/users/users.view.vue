<template>
  <div>
    <v-progress-linear
      indeterminate
      color="primary"
      v-if="loading"
    ></v-progress-linear>
    <v-row v-else dense>
      <v-col cols="12" md="6" v-for="(user, index) in users" :key="index">
        <userCard class="mb-2" :user="user"></userCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import userCard from "./userCard";

export default {
  name: "usersView",

  mixins: [serverRequestMixin],

  components: { userCard },

  computed: {
    ...mapGetters(["user"]),
  },

  data: () => ({
    loading: false,
    users: null,
  }),

  mounted() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      try {
        this.loading = true;
        const response = await this.getRequest(
          `users/byBusiness/${this.user.businessId}`
        );
        this.loading = false;

        this.users = response.users;
      } catch (error) {
        this.loading = false;
        error.status < 500
          ? (this.error = error.data.message)
          : console.error(error);
      }
    },
  },
};
</script>
