import Vue from "vue";
import Vuex from "vuex";
import {
  SET_CURRENT_USER,
  CLEAR_DATA,
  SET_TASKS,
  SET_CLIENTS,
  SET_SETTINGS
} from "./mutation-types";
import clickupService from "./../utils/clickup-service";
import freshbooksService from "./../utils/freshbooks-service";
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
    settings: {},
    tasks: [],
    clients: []
  },
  getters: {
    loggedIn: state => state.currentUser !== null
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
    }
  },
  actions: {
    async loadTasks({ commit, state }) {
      let response = await clickupService.get(
        "/team/" +
          state.settings.clickup.team_id +
          "/task?statuses%5B%5D=Awaiting%20Invoicing"
      );
      commit(SET_TASKS, response.tasks);
    },
    async loadClients({ commit, state }) {
      let response = await freshbooksService.get(
        "/accounting/account/" +
          state.settings.freshbooks.account_id +
          "/users/clients?per_page=50&search[vis_state]=active"
      );
      commit(SET_CLIENTS, response.response.result.clients);
    },
    async loadSettings({ commit, state }) {
      await fb.db
        .collection("settings")
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit(SET_SETTINGS, res.data());
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  modules: {}
});
