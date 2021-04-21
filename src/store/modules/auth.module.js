//import axios from 'axios';

const initialState = {
  user: null,
};

const state = { initialState };
const getters = {
  user: (state) => {
    return state.user;
  },
};
const actions = {
  setUser: (context, user) => {
    context.commit("setUserHandler", user);
  },
};
const mutations = {
  setUserHandler: (state, payload) => {
    state.user = payload;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
