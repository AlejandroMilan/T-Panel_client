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
  signUp: async ({ commit }, userData) => {
    const response = await axios.post("/users/signup", userData.user, {
      headers: { token: userData.token },
    });
    commit("setUserHandler", response.data.user);
    commit("setSessionTokenHandler", response.data.token);
  },
  logIn: async ({ commit }, userData) => {
    const response = await axios.post("/users/login", userData);
    commit("setUserHandler", response.data.user);
    commit("setSessionTokenHandler", response.data.token);
  },
  logOut: ({ commit }) => {
    commit("setUserHandler", null);
    commit("setSessionTokenHandler", null);
  },
  validateSession: async ({ commit }, token) => {
    const response = await axios.post(
      "/users/validateSession",
      {},
      { headers: { token } }
    );
    commit("setUserHandler", response.data.user);
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
