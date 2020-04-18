import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Settings from "../components/Settings";
import TaskView from "../components/TaskView";

const fb = require("../firebaseConfig");

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/dashboard"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tasks",
    name: "TaskView",
    component: TaskView,
    meta: {
      requiresAuth: true
    }
  }
];

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
