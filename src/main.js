import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
const fb = require("./firebaseConfig.js");
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./utils/validation";
import FirebasePlugin from "./utils/firebase-plugin";

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
      render: h => h(App)
    }).$mount("#app");
  }
});
