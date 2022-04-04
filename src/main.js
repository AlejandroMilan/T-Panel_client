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
        primary: "#FFE082",
        secondary: "#263238",
        accent: "#B3E5FC",
        error: "#B71C1C",
        background: "#f3f3f3",
      },
    },
    options: { customProperties: true },
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
