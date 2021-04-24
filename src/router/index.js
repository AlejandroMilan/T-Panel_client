import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);

import loginView from "@/components/login/login.view";
import homeView from "@/components/home/home.view";
import businessView from "@/components/business/business.view";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: loginView,
    meta: {
      guest: true,
    },
  },
  {
    path: "/panel",
    name: "Panel",
    component: homeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/panel/negocio",
    name: "Negocio",
    component: businessView,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let user = store.getters.isAuthenticated;
  let autorization = to.matched.some((record) => record.meta.requiresAuth);

  if (autorization && !user) {
    next("login");
  } else if (!autorization && user && store.getters.user.businessId) {
    next("panel");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  let user = store.getters.isAuthenticated;
  let guest = to.matched.some((record) => record.meta.guest);

  if (guest && user) {
    next("panel");
  } else if (guest && !user) {
    next("login");
  } else {
    next();
  }
});

export default router;
