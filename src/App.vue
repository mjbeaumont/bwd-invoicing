<template>
  <v-app>
    <navigation></navigation>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
export default {
  components: { Navigation }
};
</script>

<style lang="scss"></style>
