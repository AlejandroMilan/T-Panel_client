import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import auth from "./modules/auth.module";

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  masterToken: process.env.VUE_APP_MASTER_TOKEN,
  httpUrl: function () {
    return this.enviroment == "dev" ? process.env.VUE_APP_HTTP_URL_DEV : "";
  },
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    httpUrl: (state) => {
      return state.httpUrl();
    },
    masterToken: (state) => {
      return state.masterToken;
    },
  },
  mutations: {
    setSessionTokenHandler: (state, payload) => {
      state.sessionToken = payload;
    },
  },
  actions: {},
  modules: { auth },
  plugins: [createPersistedState()],
});
