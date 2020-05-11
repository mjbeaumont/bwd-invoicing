import template from "../../utils/template";
import { CLEAR_SNACK, SET_SNACK } from "../mutation-types";

const state = {
  snack: template.snack
};

const mutations = {
  [SET_SNACK](state, val) {
    state.snack = val;
  },
  [CLEAR_SNACK](state) {
    state.snack = template.snack;
  }
};

export default {
  state,
  mutations,
  namespaced: true
};
