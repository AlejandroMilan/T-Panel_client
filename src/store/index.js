import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  masterToken: process.env.VUE_APP_MASTER_TOKEN,
  httpUrl: function () {
    return this.enviroment == "dev" ? process.env.VUE_APP_HTTP_URL_DEV : "";
  },
  user: null,
  sessionToken: localStorage.getItem("sessionToken") || null,
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
    sessionToken: (state) => {
      return state.sessionToken;
    },
    masterToken: (state) => {
      return state.masterToken;
    },
  },
  mutations: {
    setUserHandler: (state, payload) => {
      state.user = payload;
    },
    setSessionTokenHandler: (state, payload) => {
      state.sessionToken = payload;
    },
  },
  actions: {
    setUser: (context, user) => {
      context.commit("setUserHandler", user);
    },
    setSessionToken: (context, token) => {
      context.commit("setSessionTokenHandler", token);
      localStorage.setItem("sessionToken", token);
    },
  },
  modules: {},
});
