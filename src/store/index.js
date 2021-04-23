import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import auth from "./modules/auth.module";

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  masterToken: process.env.VUE_APP_MASTER_TOKEN,
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    masterToken: (state) => {
      return state.masterToken;
    },
  },
  mutations: {},
  actions: {},
  modules: { auth },
  plugins: [createPersistedState()],
});
