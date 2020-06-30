import template from "../../utils/template";
import { make } from "vuex-pathify";

const state = {
  snack: template.snack()
};

const mutations = {
  ...make.mutations(state),
  CLEAR_SNACK(state) {
    state.snack = template.snack();
  }
};

export default {
  state,
  mutations,
  namespaced: true
};
