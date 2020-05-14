<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <keep-alive exclude="Login">
        <router-view></router-view>
      </keep-alive>
    </v-content>
    <v-snackbar
      v-model="snack.snackbar"
      :timeout="0"
      :color="snack.color"
      :bottom="snack.bottom"
      :top="snack.top"
      :right="snack.right"
      :left="snack.left"
      >{{ snack.text }}</v-snackbar
    >
  </v-app>
</template>

<script>
import { get, commit } from "vuex-pathify";

import Navigation from "./components/Navigation";
export default {
  components: { Navigation },
  computed: {
    currentUser: get("user/currentUser"),
    snack: get("snack/snack")
  },
  watch: {
    snack: {
      deep: true,
      handler() {
        if (this.snack.snackbar) {
          setTimeout(() => {
            commit("snack/CLEAR_SNACK");
          }, this.snack.timeout);
        }
      }
    }
  }
};
</script>

<style lang="scss"></style>
