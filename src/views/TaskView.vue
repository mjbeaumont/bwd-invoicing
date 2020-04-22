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
          <template v-slot:top>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Project</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col md="12">
                        <v-autocomplete
                          v-model="editedItem.client"
                          :items="clients"
                          item-text="organization"
                          item-value="id"
                          label="Client"
                          placeholder="Start typing to search"
                          prepend-icon="mdi-magnify"
                        ></v-autocomplete>
                      </v-col>
                      <v-col md="12">
                        <v-checkbox
                          v-model="editedItem.includeProjectName"
                          label="Include Project Name?"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.time="{ item }">
            {{ item.time | clickupHours }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:item.client="{ item }">
            {{ getClientName(item.client) }}
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
      editedIndex: -1,
      dialog: false,
      defaultItem: {
        id: null,
        project: "",
        name: "",
        time: 0,
        client: 0,
        includeProjectName: false
      },
      editedItem: {
        id: null,
        project: "",
        name: "",
        time: 0,
        client: 0,
        includeProjectName: false
      },
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
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    editItem(item) {
      this.editedIndex = this.tasks.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
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
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tasks[this.editedIndex], this.editedItem);
      } else {
        console.log("error");
      }
      this.close();
    }
  },
  name: "TaskView",
  watch: {
    dialog(val) {
      val || this.close();
    }
  }
};
</script>

<style scoped></style>
