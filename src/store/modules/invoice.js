import { make } from "vuex-pathify";

const state = () => {
  return {
    invoices: []
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

export default {
  state,
  mutations,
  namespaced: true
};
