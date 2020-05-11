import { make } from "vuex-pathify";

const fb = require("../../firebaseConfig");
const deepmerge = require("deepmerge");

const state = () => {
  return {
    settings: {}
  };
};

const mutations = make.mutations(state);

const actions = {
  async loadSettings({ commit, rootGetters }) {
    await fb.settingsCollection
      .doc(rootGetters["user/currentUserUid"])
      .get()
      .then(res => {
        commit("SET_SETTINGS", res.data());
      })
      .catch(err => {
        console.log(err);
      });
  },
  async updateSettings({ commit, rootState, rootGetters }, payload) {
    const newSettings =
      payload.mergeType === "overwrite"
        ? payload.val
        : deepmerge(rootState.setting.settings, payload.val);
    await fb.settingsCollection
      .doc(rootGetters["user/currentUserUid"])
      .update(newSettings)
      .then(() => {
        commit("SET_SETTINGS", newSettings);
      });
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
