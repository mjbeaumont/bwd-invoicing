import { make } from "vuex-pathify";

const fb = require("../../firebaseConfig");
import template from "../../utils/template";
import clickupService from "../../utils/clickup-service";

const state = () => {
  return template.settings();
};

const mutations = {
  ...make.mutations(state),
  ADD_PROJECT(state) {
    state.projects.push(template.projectSetting());
  },
  REMOVE_PROJECT(state, index) {
    state.projects.splice(index, 1);
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
      commit("SET_PROJECTS", settings.projects);
      const response = await clickupService.getFolders({
        archived: false
      });
      commit("SET_FOLDERS", response.folders);
    } catch (err) {
      console.log(err);
    }
  },
  async saveSettings({ rootGetters, state }) {
    const currentSettings = {
      clickup: state.clickup,
      freshbooks: state.freshbooks,
      projects: state.projects
    };
    try {
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
