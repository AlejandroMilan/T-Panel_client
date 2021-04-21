import axios from "axios";

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
  signUp: async (context, userData) => {
    const response = await axios.post("/users/signup", userData);
    context.commit("setUserHandler", response.user);
  },
  logIn: async (context, userData) => {
    const response = await axios.post("/users/login", userData);
    context.commit("setUserHandler", response.user);
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
