import Vue from "vue";
import Vuex from "vuex";
import { SET_CURRENT_USER } from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    settings: {}
  },
  mutations: {
    [SET_CURRENT_USER](state, val) {
      state.currentUser = val;
    }
  },
  actions: {},
  modules: {}
});
