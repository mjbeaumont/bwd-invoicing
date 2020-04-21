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
          item-key="name"
          v-model="selected"
        >
          <template v-slot:item.time="{ item }">
            {{ item.time | clickupHours }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container></template
>

<script>
export default {
  computed: {
    tasks() {
      return this.$store.state.tasks.map(task => {
        return {
          id: task.id,
          project: task.folder.name,
          name: task.name,
          time: task.time_spent
        };
      });
    }
  },
  data() {
    return {
      selected: [],
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
  name: "TaskView"
};
</script>

<style scoped></style>
