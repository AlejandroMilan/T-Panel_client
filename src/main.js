import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify/lib";
import Vuelidate from "vuelidate";
import axios from "axios";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1976d2",
        secondary: "#263238",
        accent: "#FFC107",
        error: "#B71C1C",
      },
    },
  },
});

//axios.defaults.withCredentials = true;
const isDev = process.env.VUE_APP_ENVIROMENT == "dev";
axios.defaults.baseURL = isDev
  ? process.env.VUE_APP_HTTP_URL_DEV
  : process.env.VUE_APP_HTTP_URL_PROD;

Vue.config.productionTip = false;

Vue.use(Vuelidate);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
