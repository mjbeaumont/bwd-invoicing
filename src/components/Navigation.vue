<template>
  <div v-if="loggedIn">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title @click.stop="logout">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Beaumont Web Development, LLC Invoicing</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-settings</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CLEAR_DATA } from "../store/mutation-types";

export default {
  computed: {
    ...mapGetters(["loggedIn"])
  },
  data() {
    return {
      drawer: null
    };
  },
  methods: {
    logout() {
      this.$fb.auth.signOut().then(() => {
        this.$store.commit(CLEAR_DATA);
        this.$router.push("login");
      });
    }
  },
  name: "Navigation"
};
</script>

<style scoped></style>
