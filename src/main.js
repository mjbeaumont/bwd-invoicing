import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import "./registerServiceWorker";
const fb = require("./firebaseConfig.js");
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./utils/validation";
import "./utils/filters.js";
import FirebasePlugin from "./utils/firebase-plugin";
import { SET_CURRENT_USER, SET_LOADING } from "./store/mutation-types";

Vue.config.productionTip = false;

Vue.use(FirebasePlugin, { fb: fb });

let app;
// eslint-disable-next-line
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      async created() {
        fb.auth.onAuthStateChanged(async function(user) {
          if (user) {
            store.commit("user/" + SET_CURRENT_USER, user);
            store.commit(SET_LOADING, true);
            await store.dispatch("loadSettings");
            await Promise.all([
              store.dispatch("loadClients"),
              store.dispatch("loadTasks")
            ]);
            store.commit(SET_LOADING, false);
          }
        });
      },
      render: h => h(App)
    }).$mount("#app");
  }
});
