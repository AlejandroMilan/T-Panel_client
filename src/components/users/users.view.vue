<template>
  <div>
    <v-progress-linear
      indeterminate
      color="accent"
      v-if="loading"
    ></v-progress-linear>
    <v-row v-else dense>
      <v-col
        cols="12"
        v-if="
          user.role.role === 0 ||
          user.permissions.filter((permission) => permission.key === 120)
            .length > 0
        "
      >
        <div class="d-flex justify-end">
          <v-btn color="primary" dark @click="createUser = true">
            <v-icon small class="mr-2">mdi-plus</v-icon>
            <span>Añadir usuario</span></v-btn
          >
          <userDialog
            v-if="createUser"
            :show="createUser"
            @cancel="createUser = false"
            @userSaved="userSaved"
          ></userDialog>
        </div>
      </v-col>
      <v-col cols="12" md="4" v-for="(user, index) in users" :key="index">
        <userCard
          class="mb-2"
          :userData="user"
          @userDeleted="userDeleted"
        ></userCard>
      </v-col>
    </v-row>
    <v-alert v-if="error" type="error" outlined class="mt-2">{{
      error
    }}</v-alert>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

import userCard from "./userCard";
import userDialog from "./userDialog";

export default {
  name: "usersView",

  mixins: [serverRequestMixin],

  components: { userCard, userDialog },

  computed: {
    ...mapGetters(["user"]),
  },

  data: () => ({
    error: "",
    loading: false,
    createUser: false,
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

    userSaved(newUser) {
      this.createUser = false;
      this.users = [...this.users, newUser];
    },

    userDeleted({ _id }) {
      this.users = this.users.filter((user) => user._id !== _id);
    },
  },
};
</script>
