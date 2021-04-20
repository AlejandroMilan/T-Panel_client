import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  httpUrl: function () {
    return this.enviroment == "dev" ? process.env.VUE_APP_HTTP_URL_DEV : "";
  },
  user: null,
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    user: (state) => {
      return state.user;
    },
    httpUrl: (state) => {
      return state.httpUrl();
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
