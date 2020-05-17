import { make } from "vuex-pathify";
import freshbooksService from "../../utils/freshbooks-service";

const state = () => {
  return {
    invoices: [],
    existing: []
  };
};

const mutations = {
  ...make.mutations(state),
  ADD_INVOICE(state, invoice) {
    state.invoices.push(invoice);
  },
  REMOVE_INVOICE(state, index) {
    state.invoices.splice(index, 1);
  }
};

const actions = {
  async loadExistingInvoices({ commit }) {
    let response = await freshbooksService.getInvoices({
      per_page: 50,
      "search[customerids][]": [2, 685967],
      "search[v3_status]": "draft"
    });
    if (response.invoices && response.invoices.length) {
      commit("SET_EXISTING", response.invoices);
    }
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
