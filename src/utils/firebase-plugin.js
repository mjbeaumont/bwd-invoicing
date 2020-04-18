const FirebasePlugin = {
  install(Vue, options) {
    Vue.prototype.$fb = options.fb;
  }
};

export default FirebasePlugin;
