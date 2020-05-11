const fb = require("../../firebaseConfig");
const deepmerge = require("deepmerge");
import { SET_SETTINGS } from "../mutation-types";

const state = () => {
  return {
    settings: {}
  };
};

const mutations = {
  [SET_SETTINGS](state, val) {
    state.settings = val;
  }
};

const actions = {
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
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
