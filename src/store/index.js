import Vue from "vue";
import Vuex from "vuex";
import {
  CLEAR_DATA,
  SET_SNACK,
  CLEAR_SNACK,
  SET_LOADING
} from "./mutation-types";
import user from "./modules/user";
import task from "./modules/task";
import client from "./modules/client";
import setting from "./modules/setting";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    settings: {},
    snack: {
      snackbar: false,
      top: null,
      bottom: null,
      left: null,
      right: null,
      timeout: null,
      color: ""
    },
    loading: false
  },
  mutations: {
    [CLEAR_DATA](state) {
      state.settings = {};
      state.tasks = [];
      state.clients = [];
    },
    [SET_SNACK](state, val) {
      state.snack = val;
    },
    [CLEAR_SNACK](state) {
      state.snack = {
        snackbar: false,
        top: null,
        bottom: null,
        left: null,
        right: null,
        timeout: null,
        color: ""
      };
    },
    [SET_LOADING](state, val) {
      state.loading = val;
    }
  },
  actions: {
    clearData({ commit }) {
      commit(CLEAR_DATA);
      commit(CLEAR_SNACK);
    }
  },
  modules: {
    user,
    task,
    client,
    setting
  },
  strict: process.env.NODE_ENV !== "production"
});
