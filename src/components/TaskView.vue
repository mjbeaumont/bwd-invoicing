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
          :loading="loading"
        >
          <template v-slot:item.time="{ item }">
            {{ item.time | clickupHours }}
          </template>
          <template v-slot:item.client="props">
            <v-edit-dialog
              :return-value.sync="props.item.client"
              large
              persistent
              >{{ getClientName(props.item.client)
              }}<template v-slot:input
                ><v-autocomplete
                  v-model="props.item.client"
                  :items="clients"
                  item-text="organization"
                  item-value="id"
                  label="Client"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </template></v-edit-dialog
          ></template>
          <template v-slot:item.includeProjectName="{ item }">
            <v-simple-checkbox
              v-model="item.includeProjectName"
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn fab fixed bottom right color="accent" v-if="selected.length"
        ><v-icon>mdi-receipt</v-icon></v-btn
      >
    </v-fab-transition>
  </v-container></template
>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["clients", "loading"]),
    tasks() {
      return this.$store.state.tasks.map(task => {
        return {
          id: task.id,
          project: task.folder.name,
          name: task.name,
          time: task.time_spent,
          client: this.getClient(task.folder.id),
          includeProjectName: this.getInclude(task.folder.id)
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
        },
        {
          text: "Client",
          value: "client"
        },
        {
          text: "Include Project Name",
          value: "includeProjectName"
        }
      ]
    };
  },
  methods: {
    getClient(folderId) {
      console.log(folderId);
      return null;
    },
    getInclude(folderId) {
      console.log(folderId);
      return false;
    },
    getClientName(id) {
      return this.$store.getters.clientName(id);
    }
  },
  name: "TaskView"
};
</script>

<style scoped></style>
