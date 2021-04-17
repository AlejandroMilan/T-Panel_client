import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
  user: null,
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    user: (state) => {
      return state.user;
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
