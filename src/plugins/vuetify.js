import Vue from "vue";
import Vuetify from "vuetify/lib";
import { preset } from "vue-cli-plugin-vuetify-preset-rally/preset";
import { Ripple } from "vuetify/lib/directives";

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
});

export default new Vuetify({
  preset
});
