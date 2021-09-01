import clickupService from "../../utils/clickup-service";
import { make } from "vuex-pathify";

const state = () => {
  return {
    tasks: []
  };
};

const mutations = make.mutations(state);

const actions = {
  async loadTasks({ commit }) {
    let response = await clickupService.getTasks({
      ["statuses[]"]: "Ready To Invoice"
    });
    if (response.tasks && response.tasks.length) {
      const tasks = response.tasks.filter(task => task.time_spent > 0);
      commit("SET_TASKS", tasks);
    }
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
