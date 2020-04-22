<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <keep-alive>
        <router-view @loadData="loadData"></router-view>
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
import { SET_LOADING } from "./store/mutation-types";
import Navigation from "./components/Navigation";
export default {
  components: { Navigation },
  computed: {
    ...mapState(["currentUser"]),
    snack() {
      return this.$store.state.snack;
    }
  },
  async created() {
    if (this.currentUser) {
      this.$store.commit(SET_LOADING, true);
      await this.loadData();
      this.$store.commit(SET_LOADING, false);
    }
  },
  methods: {
    async loadData() {
      await this.$store.dispatch("loadSettings");
      await Promise.all([
        this.$store.dispatch("loadClients"),
        this.$store.dispatch("loadTasks")
      ]);
    }
  }
};
</script>

<style lang="scss"></style>
