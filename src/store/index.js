import Vue from "vue";
import Vuex from "vuex";
import pathify, { make } from "vuex-pathify";

// import the auto exporter
import modules from "./modules";

Vue.use(Vuex);

const state = () => {
  return {
    loading: false
  };
};

const mutations = make.mutations(state);

const actions = {
  clearData({ commit }) {
    commit("setting/SET_SETTINGS", {});
    commit("task/SET_TASKS", []);
    commit("task/SET_SELECTED", []);
    commit("client/SET_CLIENTS", []);
    commit("snack/CLEAR_SNACK");
    commit("invoice/SET_INVOICES", []);
  }
};

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: modules,
  strict: process.env.NODE_ENV !== "production",
  plugins: [pathify.plugin]
});
