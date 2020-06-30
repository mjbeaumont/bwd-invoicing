import { make } from "vuex-pathify";
import freshbooksService from "../../utils/freshbooks-service";

const state = () => {
  return {
    invoices: [],
    existing: []
  };
};

const getters = {
  getClientIds(state) {
    return state.invoices.map(invoice => invoice.customerid);
  },
  getExistingInvoices: state => clientId => {
    return state.existing.filter(invoice => invoice.customerid === clientId);
  }
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
  async loadExistingInvoices({ commit, getters }) {
    let response = await freshbooksService.getInvoices({
      per_page: 50,
      "search[customerids][]": getters.getClientIds,
      "search[v3_status]": "draft",
      "include[]": "lines"
    });
    if (response.invoices && response.invoices.length) {
      commit("SET_EXISTING", response.invoices);
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
