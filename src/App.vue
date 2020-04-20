<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
export default {
  components: { Navigation }
};
</script>

<style lang="scss"></style>
