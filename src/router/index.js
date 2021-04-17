import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import loginView from "@/components/login/login.view";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: loginView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
