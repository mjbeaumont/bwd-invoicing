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
      :timeout="snack.timeout"
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
import { mapState } from "vuex";

import Navigation from "./components/Navigation";
export default {
  components: { Navigation },
  computed: {
    ...mapState("user", ["currentUser"]),
    snack() {
      return this.$store.state.snack;
    }
  }
};
</script>

<style lang="scss"></style>
