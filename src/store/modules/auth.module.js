import axios from "axios";

const initialState = {
  user: null,
  sessionToken: null,
};

const state = { initialState };
const getters = {
  isAuthenticated: (state) => !!state.user,
  user: (state) => {
    return state.user;
  },
  sessionToken: (state) => {
    return state.sessionToken;
  },
};
const actions = {
  signUp: async (context, userData) => {
    const response = await axios.post("/users/signup", userData);
    context.commit("setUserHandler", response.user);
    context.commit("setSessionTokenHandler", response.token);
  },
  logIn: async (context, userData) => {
    const response = await axios.post("/users/login", userData);
    context.commit("setUserHandler", response.user);
    context.commit("setSessionTokenHandler", response.token);
  },
};
const mutations = {
  setUserHandler: (state, payload) => {
    state.user = payload;
  },
  setSessionTokenHandler: (state, payload) => {
    state.sessionToken = payload;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
