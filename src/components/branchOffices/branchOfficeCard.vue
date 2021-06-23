<template>
  <div style="height: 100%">
    <v-card color="secondary" dark height="100%">
      <v-card-title>
        <span>{{ branchOffice.name }}</span>
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
      <v-card-subtitle v-if="branchOffice.adress">{{
        branchOffice.adress
      }}</v-card-subtitle>
      <v-card-text>
        <span>Creada por: {{ branchOffice.createdBy.name }}</span>
      </v-card-text>
    </v-card>
    <branchOfficeDialog
      v-if="showBranchDialog"
      :show="showBranchDialog"
    ></branchOfficeDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import branchOfficeDialog from "./branchOfficeDialog";

export default {
  name: "branchOfficeCard",

  props: {
    branchOffice: { type: Object, required: true },
  },

  components: { branchOfficeDialog },

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
  },

  data: () => ({
    loading: false,
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
  }),

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
      console.log("delete");
    },
  },
};
</script>
