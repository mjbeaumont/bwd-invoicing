<template>
  <div v-if="loggedIn">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link to="dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="tasks">
          <v-list-item-action>
            <v-icon>mdi-playlist-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tasks</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title @click.stop="logout">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dense color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Beaumont Web Development, LLC Invoicing</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="settings"><v-icon>mdi-settings</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CLEAR_DATA } from "../store/mutation-types";

export default {
  computed: {
    ...mapGetters("user", ["loggedIn"])
  },
  data() {
    return {
      drawer: null
    };
  },
  methods: {
    async logout() {
      let response = await this.$store.dispatch("user/logout");
      if (response) {
        await this.$store.dispatch(CLEAR_DATA);
        await this.$router.push("login");
      }
    }
  },
  name: "Navigation"
};
</script>

<style scoped></style>
