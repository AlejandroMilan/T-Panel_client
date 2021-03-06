import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import auth from "./modules/auth.module";

const repairsColors = {
  100: "red darken-4",
  200: "amber darken-4",
  300: "green darken-3",
  310: "#1976d2",
  400: "indigo",
};

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  masterToken: process.env.VUE_APP_MASTER_TOKEN,
  globalError: null,
  isNavigating: false,
  countryCode: "+52",
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    masterToken: (state) => {
      return state.masterToken;
    },
    globalError: (state) => {
      return state.globalError;
    },
    isNavigating: (state) => {
      return state.isNavigating;
    },
    countryCode: (state) => {
      return state.countryCode;
    },
    isRole: (state) => {
      return function (roleKey) {
        return state.auth.user.role && state.auth.user.role.role == roleKey;
      };
    },
    hasPermission: (state) => {
      return function (permissionKey) {
        return (
          state.auth.user.permissions.find((e) => e.key == permissionKey) ||
          state.auth.user.role.role == 0
        );
      };
    },
    getRepairStatusColor() {
      return function (statusKey) {
        return repairsColors[statusKey];
      };
    },
  },
  mutations: {
    setGlobalErrorHandler: (state, payload) => {
      state.globalError = payload;
    },
    setIsNavigating: (state, payload) => {
      state.isNavigating = payload;
    },
    setCountryCode: (state, payload) => {
      state.countryCode = payload;
    },
  },
  actions: {
    setGlobalError: ({ commit }, error) => {
      const err = {
        title: error.title,
        message: error.message,
      };
      commit("setGlobalErrorHandler", err);
    },
    clearGlobalError: ({ commit }) => {
      commit("setGlobalErrorHandler", null);
    },
    changeNav: ({ commit }, payload) => {
      commit("setIsNavigating", payload);
    },
  },
  modules: { auth },
  plugins: [createPersistedState()],
});
