<template>
  <div style="height: 100%">
    <v-card color="secondary" dark height="100%">
      <v-card-title>
        <span>{{ currentBranch.name }}</span>
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
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon small class="mr-2" :color="option.color">{{
                      option.icon
                    }}</v-icon>
                    <span>{{ option.title }}</span></v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-subtitle v-if="currentBranch.adress">{{
        currentBranch.adress
      }}</v-card-subtitle>
      <v-card-text>
        <span>Creada por: {{ currentBranch.createdBy.name }}</span>
      </v-card-text>
    </v-card>
    <branchOfficeDialog
      v-if="showBranchDialog"
      :show="showBranchDialog"
      :current="currentBranch"
      @cancel="showBranchDialog = false"
      @branchSaved="branchSaved"
    ></branchOfficeDialog>
    <deleteBranchOfficeDialog
      v-if="showDeleteDialog"
      :show="showDeleteDialog"
      :branchId="currentBranch._id"
      @cancel="showDeleteDialog = false"
      @branchDeleted="branchDeleted"
    ></deleteBranchOfficeDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import branchOfficeDialog from "./branchOfficeDialog";
import deleteBranchOfficeDialog from "./deleteBranchOfficeDialog";

export default {
  name: "branchOfficeCard",

  props: {
    branchOffice: { type: Object, required: true },
  },

  components: { branchOfficeDialog, deleteBranchOfficeDialog },

  computed: {
    ...mapGetters(["user"]),
    canChange() {
      if (this.user.role.role === 0) return true;
      if (this.user.permissions.filter((e) => e.key === 430).length > 0)
        return true;
      if (this.user.permissions.filter((e) => e.key === 440).length > 0)
        return true;
      return false;
    },
  },

  watch: {
    methodLaunched() {
      if (this.methodLaunched !== null) this[this.methodLaunched]();
      this.methodLaunched = null;
    },

    branchOffice() {
      this.currentBranch = this.branchOffice;
    },
  },

  data: () => ({
    loading: false,
    currentBranch: null,
    options: [
      {
        title: "Modificar",
        color: null,
        icon: "mdi-pencil",
        method: "activateEditBranch",
        permission: 430,
      },
      {
        title: "Eliminar",
        color: "error",
        icon: "mdi-delete",
        method: "activateDeleteDialog",
        permission: 440,
      },
    ],
    methodLaunched: null,
    showBranchDialog: false,
    showDeleteDialog: false,
  }),

  created() {
    this.currentBranch = this.branchOffice;
  },

  methods: {
    canUse(permission) {
      if (this.user.role.role === 0) return true;
      if (this.user.permissions.filter((e) => e.key === permission).length > 0)
        return true;
      return false;
    },

    activateEditBranch() {
      this.showBranchDialog = true;
    },

    activateDeleteDialog() {
      this.showDeleteDialog = true;
    },

    branchSaved(newData) {
      this.showBranchDialog = false;
      this.currentBranch = newData;
    },

    branchDeleted(branchId) {
      this.showDeleteDialog = false;
      this.$emit("branchDeleted", branchId);
    },
  },
};
</script>
