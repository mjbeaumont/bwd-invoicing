import Vue from "vue";
import Vuex from "vuex";
import {
  SET_CURRENT_USER,
  CLEAR_DATA,
  SET_TASKS,
  SET_CLIENTS,
  SET_SETTINGS,
  SET_SNACK,
  CLEAR_SNACK,
  SET_LOADING
} from "./mutation-types";
import clickupService from "./../utils/clickup-service";
import freshbooksService from "./../utils/freshbooks-service";
const fb = require("../firebaseConfig");
const deepmerge = require("deepmerge");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit(SET_CURRENT_USER, user);
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    settings: {},
    tasks: [],
    clients: [],
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
    loggedIn: state => state.currentUser !== null,
    clientName: state => val => {
      const client = state.clients.find(client => client.id === val);
      if (client) {
        return client.organization;
      }

      return "None selected";
    }
  },
  mutations: {
    [SET_CURRENT_USER](state, val) {
      state.currentUser = val;
    },
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
      state.currentUser = null;
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
    async loadTasks({ commit, state }) {
      let response = await clickupService.get(
        "/team/" +
          state.settings.clickup.team_id +
          "/task?statuses%5B%5D=Awaiting%20Invoicing"
      );
      if (response.tasks && response.tasks.length) {
        const tasks = response.tasks.filter(task => task.time_spent > 0);
        commit(SET_TASKS, tasks);
      }
    },
    async loadClients({ commit, state }) {
      let response = await freshbooksService.get(
        "/accounting/account/" +
          state.settings.freshbooks.account_id +
          "/users/clients?per_page=50&search[vis_state]=0"
      );
      if (response.clients && response.clients.length) {
        commit(SET_CLIENTS, response.clients);
      }
    },
    async loadSettings({ commit, state }) {
      await fb.settingsCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit(SET_SETTINGS, res.data());
        })
        .catch(err => {
          console.log(err);
        });
    },
    async updateSettings({ commit, state }, val) {
      const newSettings = deepmerge(state.settings, val);
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
  modules: {}
});
