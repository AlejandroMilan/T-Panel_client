import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import axios from "axios";

axios.defaults.withCredentials = true;
const isDev = process.env.VUE_APP_ENVIROMENT == "dev";
axios.defaults.baseURL = isDev
  ? process.env.VUE_APP_HTTP_URL_DEV
  : "https://gabbyblog.herokuapp.com/";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
