<template
  ><v-container>
    <v-row>
      <v-col lg="4"
        ><v-card :loading="loading" class="dashboard-card">
          <v-card-title>Outstanding Tasks</v-card-title>
          <v-card-text
            class="display-3 font-weight-light pb-2 mb-1 border-bottom"
            >{{ countTasks }}</v-card-text
          >
          <v-icon
            x-large
            color="white"
            style="background-color: #ff420f;box-shadow: 0 0 10px 5px rgba(255, 66, 15, 0.35);"
            >mdi-playlist-check</v-icon
          >
        </v-card></v-col
      >
      <v-col lg="4"
        ><v-card :loading="loading" class="dashboard-card">
          <v-card-title>Billable Hours</v-card-title>
          <v-card-text
            class="display-3 font-weight-light pb-2 mb-1 border-bottom"
            >{{ billableHours | clickupHours }}</v-card-text
          >
          <v-icon
            x-large
            color="white"
            style="background-color: #00b67a;box-shadow: 0 0 10px 5px rgba(0, 182, 122, 0.35)"
            >mdi-currency-usd</v-icon
          >
        </v-card></v-col
      >
      <v-col lg="4"
        ><v-card :loading="loading" class="dashboard-card">
          <v-card-title># of Projects</v-card-title>
          <v-card-text
            class="display-3 font-weight-light pb-2 mb-1 border-bottom"
            >{{ numberProjects }}</v-card-text
          >
          <v-icon
            x-large
            color="white"
            style="background-color: #00bbdd;box-shadow: 0 0 10px 5px rgba(0, 187, 221, 0.35)"
            >mdi-folder-multiple-outline</v-icon
          >
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  computed: {
    tasks: get("task/tasks"),
    loading: get("loading"),
    countTasks() {
      return this.tasks.length;
    },
    billableHours() {
      return this.tasks.reduce((cur, task) => {
        let time_spent = Number.parseInt(task.time_spent);
        return !isNaN(time_spent) ? time_spent + cur : cur;
      }, 0);
    },
    numberProjects() {
      const uniqueProjects = this.tasks.filter((task, pos, arr) => {
        return (
          arr.map(mapObj => mapObj.project.name).indexOf(task.project.name) ===
          pos
        );
      });

      return uniqueProjects.length;
    }
  },
  name: "Dashboard"
};
</script>

<style scoped lang="scss">
@import "../../node_modules/vuetify/src/styles/styles";
.dashboard-card {
  position: relative;
  min-height: 150px;
  .v-icon {
    position: absolute;
    right: -10px;
    height: 57px;
    width: 57px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 2px;
  }
}
</style>
