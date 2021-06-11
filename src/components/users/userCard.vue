<template>
  <div>
    <v-card outlined :loading="loading">
      <v-card-title
        >{{ currentUser ? currentUser.name : "" }}
        <v-spacer></v-spacer>
        <v-menu bottom left v-if="canChange">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" :disabled="loading">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group>
              <v-list-item
                v-for="(option, index) in options"
                :key="index"
                @click="methodLaunched = option.method"
                :disabled="!canUse(option.permission)"
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
      <v-card-subtitle>
        {{ currentUser ? currentUser.role.name : "" }}
      </v-card-subtitle>
      <v-card-text v-if="deleteError">
        <v-alert type="error" dense outlined>{{ deleteError }}</v-alert>
      </v-card-text>
    </v-card>
    <userDialog
      v-if="editUser"
      :show="editUser"
      :currentUser="currentUser"
      @cancel="editUser = false"
      @userSaved="userSaved"
    ></userDialog>
    <v-dialog
      v-if="showDeleteDialog"
      v-model="showDeleteDialog"
      persistent
      width="400"
    >
      <v-card :loading="loading">
        <v-card-title>Continuar</v-card-title>
        <v-card-text>{{
          `¿Está seguro de eliminar a ${currentUser.name}?`
        }}</v-card-text>
        <v-card-actions>
          <v-btn color="secondary" outlined @click="showDeleteDialog = false"
            >No, cancelar</v-btn
          >
          <v-btn color="error" dark @click="deleteUser"
            ><v-icon>mdi-delete-outline</v-icon> Sí, eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userDialog from "./userDialog";
import serverRequestMixin from "@/mixins/serverRequest.mixin";

export default {
  name: "userCard",

  mixins: [serverRequestMixin],

  components: { userDialog },

  props: {
    userData: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(["user"]),

    canChange() {
      if (this.userData.role.role === 0) return false;
      if (this.userData._id === this.user._id) return false;
      return true;
    },
  },

  watch: {
    methodLaunched() {
      if (this.methodLaunched !== null) this[this.methodLaunched]();
      this.methodLaunched = null;
    },

    userData() {
      this.currentUser = this.userData;
    },
  },

  data: () => ({
    loading: false,
    showDeleteDialog: false,
    currentUser: null,
    editUser: false,
    deleteError: null,
    options: [
      {
        title: "Modificar",
        color: "primary",
        icon: "mdi-pencil",
        method: "activateEditUser",
        permission: 130,
      },
      {
        title: "Eliminar",
        color: "error",
        icon: "mdi-delete",
        method: "activateDeleteDialog",
        permission: 140,
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

    activateDeleteDialog() {
      this.showDeleteDialog = true;
    },

    async deleteUser() {
      this.showDeleteDialog = false;
      this.loading = true;
      try {
        const response = await this.deleteRequest(
          `/users/${this.user.businessId}/${this.currentUser._id}`
        );
        this.loading = false;

        this.$emit("userDeleted", response.userDeleted);
      } catch (error) {
        this.loading = false;
        this.deleteError = error.data.message;
        if (error.status >= 500) console.error(error.data);
      }
    },

    canUse(permission) {
      if (this.user.role.role === 0) return true;
      if (
        this.user.permissions.filter(
          (permissionItem) => permissionItem.key === permission
        ).length > 0
      )
        return true;
      return false;
    },
  },
};
</script>
