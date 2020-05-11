import Vue from "vue";
import Vuex from "vuex";
import { CLEAR_DATA, CLEAR_SNACK, SET_LOADING } from "./mutation-types";
import user from "./modules/user";
import task from "./modules/task";
import client from "./modules/client";
import setting from "./modules/setting";
import snack from "./modules/snack";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    [CLEAR_DATA](state) {
      state.settings = {};
      state.tasks = [];
      state.clients = [];
    },
    [SET_LOADING](state, val) {
      state.loading = val;
    }
  },
  actions: {
    clearData({ commit }) {
      commit(CLEAR_DATA);
      commit("snack/" + CLEAR_SNACK);
    }
  },
  modules: {
    user,
    task,
    client,
    setting,
    snack
  },
  strict: process.env.NODE_ENV !== "production"
});
