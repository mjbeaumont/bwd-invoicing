import Vue from "vue";
import Vuex from "vuex";
import {
  CLEAR_DATA,
  SET_TASKS,
  SET_CLIENTS,
  SET_SETTINGS,
  SET_SNACK,
  CLEAR_SNACK,
  SET_LOADING,
  SET_SELECTED
} from "./mutation-types";
import clickupService from "./../utils/clickup-service";
import freshbooksService from "./../utils/freshbooks-service";
import user from "./modules/user";
const fb = require("../firebaseConfig");
const deepmerge = require("deepmerge");

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    settings: {},
    tasks: [],
    clients: [],
    selected: [],
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
  getters: {
    clientName: state => val => {
      const client = state.clients.find(client => client.id === val);
      if (client) {
        return client.organization;
      }
    }
  },
  mutations: {
    [SET_TASKS](state, val) {
      state.tasks = val;
    },
    [SET_CLIENTS](state, val) {
      state.clients = val;
    },
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
    },
    [SET_SELECTED](state, val) {
      state.selected = val;
    }
  },
  actions: {
    async loadTasks({ commit }) {
      let response = await clickupService.getTasks({
        ["statuses[]"]: "Awaiting Invoicing"
      });
      if (response.tasks && response.tasks.length) {
        const tasks = response.tasks.filter(task => task.time_spent > 0);
        commit(SET_TASKS, tasks);
      }
    },
    async loadClients({ commit }) {
      let response = await freshbooksService.getClients({
        per_page: 50,
        ["search[vis_state]"]: 0
      });
      if (response.clients && response.clients.length) {
        commit(SET_CLIENTS, response.clients);
      }
    },
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
    user
  },
  strict: process.env.NODE_ENV !== "production"
});
