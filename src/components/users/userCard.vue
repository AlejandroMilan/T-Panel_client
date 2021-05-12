<template>
  <div>
    <v-card outlined>
      <v-card-title
        >{{ currentUser ? currentUser.name : "" }}
        <v-spacer></v-spacer>
        <v-menu
          bottom
          left
          v-if="
            (currentUser && currentUser.role.role !== 0) ||
            (currentUser && currentUser._id !== user._id)
          "
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group>
              <v-list-item
                v-for="(option, index) in options"
                :key="index"
                @click="methodLaunched = option.method"
              >
                <v-list-item-icon
                  ><v-icon :color="option.color">{{
                    option.icon
                  }}</v-icon></v-list-item-icon
                >
                <v-list-item-title>{{ option.title }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-subtitle> {{ currentUser ? currentUser.role.name : '' }} </v-card-subtitle>
    </v-card>
    <userDialog
      v-if="editUser"
      :show="editUser"
      :currentUser="currentUser"
      @cancel="editUser = false"
      @userSaved="userSaved"
    ></userDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userDialog from "./userDialog";

export default {
  name: "userCard",

  components: { userDialog },

  props: {
    userData: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(["user"]),
  },

  watch: {
    methodLaunched() {
      if (this.methodLaunched !== null) this[this.methodLaunched]();
      this.methodLaunched = null;
    },
  },

  data: () => ({
    currentUser: null,
    editUser: false,
    options: [
      {
        title: "Modificar",
        color: "primary",
        icon: "mdi-pencil",
        method: "activateEditUser",
      },
      {
        title: "Eliminar",
        color: "error",
        icon: "mdi-delete",
      },
    ],
    methodLaunched: null,
  }),

  mounted() {
    this.currentUser = this.userData;
  },

  methods: {
    activateEditUser() {
      this.editUser = true;
    },

    userSaved(userUpdated) {
      this.editUser = false;
      this.currentUser = userUpdated;
    },
  },
};
</script>
