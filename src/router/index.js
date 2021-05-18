import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);

import loginView from "@/components/login/login.view";
import homeView from "@/components/home/home.view";
import businessView from "@/components/business/business.view";
import usersView from "@/components/users/users.view";
import repairsView from "@/components/repairs/repairs.view"

const routes = [
  {
    path: "*",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: loginView,
  },
  {
    path: "/panel/home",
    name: "Panel",
    component: homeView,
    meta: {
      requiresAuth: true,
      requireBusiness: true,
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
  {
    path: "/panel/usuarios",
    name: "Usuarios",
    component: usersView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/panel/reparaciones",
    name: "Reparaciones",
    component: repairsView,
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
  const user = store.getters.isAuthenticated;
  const autorization = to.matched.some((record) => record.meta.requiresAuth);

  if (autorization && !user) next("login");
  else if (!autorization && user) next("panel/home");
  else next();
});

router.beforeEach((to, from, next) => {
  const business = store.getters.user?.businessId;
  const requireBusiness = to.matched.some(
    (record) => record.meta.requireBusiness
  );

  if (requireBusiness && !business) next("panel/negocio");
  else next();
});

export default router;
