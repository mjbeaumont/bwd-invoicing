const fb = require("../../firebaseConfig");

const state = () => {
  return {
    currentUser: null
  };
};

const getters = {
  loggedIn: state => state.currentUser !== null,
  currentUserUid: state => (state.currentUser ? state.currentUser.uid : null)
};

const mutations = {
  SET_CURRENT_USER(state, val) {
    state.currentUser = val ? val.toJSON() : val;
  }
};

const actions = {
  async login({ commit }, payload) {
    let response;
    try {
      response = await fb.auth.signInWithEmailAndPassword(
        payload.username,
        payload.password
      );
    } catch (err) {
      return { success: false, msg: err.message };
    }

    commit("SET_CURRENT_USER", response.user);
    return { success: true, msg: "" };
  },
  async logout({ commit }) {
    try {
      await fb.auth.signOut();
    } catch (err) {
      console.log(err);
      return false;
    }

    commit("SET_CURRENT_USER", null);
    return true;
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
