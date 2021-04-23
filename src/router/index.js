import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);

import loginView from "@/components/login/login.view";
import homeView from "@/components/home/home.view";

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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated && store.getters.user.businessId) {
      next();
      return;
    }
    if (store.getters.isAuthenticated && !store.getters.user.businessId) {
      next("panel/negocio");
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/panel");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
