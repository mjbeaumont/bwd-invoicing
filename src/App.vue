<template>
  <v-app>
    <navigation></navigation>
    <v-content>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
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
