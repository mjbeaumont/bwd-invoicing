import Vue from "vue";
import VueRouter from "vue-router";
const fb = require("../firebaseConfig");

Vue.use(VueRouter);

const routes = [{}];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !fb.currentUser) {
    next("/login");
  } else if (requiresAuth && fb.currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
