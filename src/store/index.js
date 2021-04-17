import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
  user: null,
};

export default new Vuex.Store({
  state: { initialState },
  mutations: {},
  actions: {},
  modules: {},
});
