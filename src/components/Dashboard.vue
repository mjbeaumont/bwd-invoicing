<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :items="tasks"
          :headers="headers"
          show-select
          sort-by="project"
          :items-per-page="20"
          :loading="loading"
          item-key="name"
          v-model="selected"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    tasks() {
      return this.$store.state.tasks.map(task => {
        return {
          id: task.id,
          project: task.folder.name,
          name: task.name,
          time: task.time_spent / 3600000 + "h"
        };
      });
    },
    state() {
      return this.$store.state;
    }
  },
  data() {
    return {
      selected: [],
      loading: true,
      headers: [
        {
          text: "Project Name",
          value: "project",
          align: "start"
        },
        {
          text: "Task Name",
          value: "name"
        },
        {
          text: "Time",
          value: "time"
        }
      ]
    };
  },
  async mounted() {
    await this.$store.dispatch("loadSettings");
    await Promise.all([
      this.$store.dispatch("loadClients"),
      this.$store.dispatch("loadTasks")
    ]);
    this.loading = false;
  },
  name: "Dashboard"
};
</script>

<style scoped></style>
