import { SET_SELECTED, SET_TASKS } from "../mutation-types";
import clickupService from "../../utils/clickup-service";

const state = () => {
  return {
    tasks: [],
    selected: []
  };
};

const mutations = {
  [SET_TASKS](state, val) {
    state.tasks = val;
  },
  [SET_SELECTED](state, val) {
    state.selected = val;
  }
};

const actions = {
  async loadTasks({ commit }) {
    let response = await clickupService.getTasks({
      ["statuses[]"]: "Awaiting Invoicing"
    });
    if (response.tasks && response.tasks.length) {
      const tasks = response.tasks.filter(task => task.time_spent > 0);
      commit(SET_TASKS, tasks);
    }
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
