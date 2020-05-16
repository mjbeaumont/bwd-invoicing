import { make } from "vuex-pathify";

const fb = require("../../firebaseConfig");
import { settings } from "../../utils/template";
import clickupService from "../../utils/clickup-service";
import { ProjectSetting, ClientSetting } from "../../utils/classes";
import { convertClassesToNativeObjects } from "../../utils/functions";

const state = () => {
  return settings();
};

const mutations = {
  ...make.mutations(state),
  ADD_PROJECT(state, project) {
    state.projects.push(project);
  },
  REMOVE_PROJECT(state, index) {
    state.projects.splice(index, 1);
  },
  ADD_CLIENT(state, client) {
    state.clients.push(client);
  },
  REMOVE_CLIENT(state, index) {
    state.clients.splice(index, 1);
  }
};

const actions = {
  async loadSettings({ commit, rootGetters }) {
    try {
      const res = await fb.settingsCollection
        .doc(rootGetters["user/currentUserUid"])
        .get();
      const settings = res.data();
      commit("SET_CLICKUP", settings.clickup);
      commit("SET_FRESHBOOKS", settings.freshbooks);
      settings.projects.forEach(project => {
        commit("ADD_PROJECT", new ProjectSetting(project));
      });
      settings.clients.forEach(client => {
        commit("ADD_CLIENT", new ClientSetting(client));
      });
      const response = await clickupService.getFolders({
        archived: false
      });
      commit("SET_FOLDERS", response.folders);
    } catch (err) {
      console.log(err);
    }
  },
  async saveSettings({ rootGetters, state }) {
    try {
      // eslint-disable-next-line no-unused-vars
      const { folders, projects, clients, ...currentSettings } = state;
      // firebase won't allow you to write custom classes to the store
      currentSettings.projects = convertClassesToNativeObjects(projects);
      currentSettings.clients = convertClassesToNativeObjects(clients);
      await fb.settingsCollection
        .doc(rootGetters["user/currentUserUid"])
        .update(currentSettings);
    } catch (err) {
      console.log(err);
    }
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
