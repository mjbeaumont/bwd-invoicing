import Vue from "vue";
import Vuex from "vuex";
import {
  CLEAR_DATA,
  SET_SETTINGS,
  SET_SNACK,
  CLEAR_SNACK,
  SET_LOADING
} from "./mutation-types";
import user from "./modules/user";
import task from "./modules/task";
import client from "./modules/client";
const fb = require("../firebaseConfig");
const deepmerge = require("deepmerge");

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
    [SET_SETTINGS](state, val) {
      state.settings = val;
    },
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
    async loadSettings({ commit, rootGetters }) {
      await fb.settingsCollection
        .doc(rootGetters["user/currentUserUid"])
        .get()
        .then(res => {
          commit(SET_SETTINGS, res.data());
        })
        .catch(err => {
          console.log(err);
        });
    },
    async updateSettings({ commit, state }, payload) {
      const newSettings =
        payload.mergeType === "overwrite"
          ? payload.val
          : deepmerge(state.settings, payload.val);
      await fb.settingsCollection
        .doc(state.currentUser.uid)
        .update(newSettings)
        .then(() => {
          commit(SET_SETTINGS, newSettings);
        });
    },
    clearData({ commit }) {
      commit(CLEAR_DATA);
      commit(CLEAR_SNACK);
    }
  },
  modules: {
    user,
    task,
    client
  },
  strict: process.env.NODE_ENV !== "production"
});
