import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import auth from "./modules/auth.module";

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
