import { SET_CLIENTS } from "../mutation-types";
import freshbooksService from "../../utils/freshbooks-service";

const state = () => {
  return {
    clients: []
  };
};

const getters = {
  clientName: state => val => {
    const client = state.clients.find(client => client.id === val);
    if (client) {
      return client.organization;
    }
  }
};

const mutations = {
  [SET_CLIENTS](state, val) {
    state.clients = val;
  }
};

const actions = {
  async loadClients({ commit }) {
    let response = await freshbooksService.getClients({
      per_page: 50,
      ["search[vis_state]"]: 0
    });
    if (response.clients && response.clients.length) {
      commit(SET_CLIENTS, response.clients);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
