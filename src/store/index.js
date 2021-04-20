import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
  enviroment: process.env.VUE_APP_ENVIROMENT,
  httpUrl: function () {
    return this.enviroment == "dev" ? process.env.VUE_APP_HTTP_URL_DEV : "";
  },
  user: null,
  sessionToken: null,
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
    },
  },
  modules: {},
});
