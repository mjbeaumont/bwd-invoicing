import Vue from "vue";
import Vuex from "vuex";
import { SET_CURRENT_USER, CLEAR_DATA } from "./mutation-types";
const fb = require("../firebaseConfig");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit(SET_CURRENT_USER, user);
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    settings: {}
  },
  getters: {
    loggedIn: state => state.currentUser !== null
  },
  mutations: {
    [SET_CURRENT_USER](state, val) {
      state.currentUser = val;
    },
    [CLEAR_DATA](state) {
      state.currentUser = null;
    }
  },
  actions: {},
  modules: {}
});
