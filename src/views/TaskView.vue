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
      <v-btn
        fab
        fixed
        bottom
        right
        x-large
        color="accent"
        v-if="selected.length"
        @click="confirm"
        ><v-icon>mdi-receipt</v-icon></v-btn
      >
    </v-fab-transition>
    <v-dialog v-model="confirmDialog" max-width="350"
      ><v-card
        ><v-card-title>Generate Invoices?</v-card-title
        ><v-card-text>
          You are about to generate invoices for
          {{ selected.length }} tasks. </v-card-text
        ><v-card-actions
          ><v-spacer></v-spacer>
          <v-btn text color="secondary" @click="confirmDialog = false"
            >Cancel</v-btn
          >
          <v-btn text color="success" @click="generate">generate</v-btn>
        </v-card-actions></v-card
      >
    </v-dialog>
  </v-container></template
>

<script>
import { mapState } from "vuex";
import { SET_SNACK, SET_SELECTED } from "../store/mutation-types";
import freshbooksService from "../utils/freshbooks-service";
import clickupService from "../utils/clickup-service";
export default {
  computed: {
    ...mapState(["clients", "loading", "settings"]),
    tasks() {
      return this.$store.state.tasks.map(task => {
        return {
          id: task.id,
          project: task.folder.name,
          name: task.name,
          time: task.time_spent,
          client: 0,
          includeProjectName: false
        };
      });
    }
  },
  created() {
    if (!this.loading) {
      this.setDefaults();
    }
  },
  data() {
    return {
      selected: [],
      editedIndex: -1,
      confirmDialog: false,
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
    getClientName(id) {
      return id ? this.$store.getters.clientName(id) : "None selected";
    },
    confirm() {
      const valid = this.selected.every(task => task.client);
      if (valid) {
        this.$store.commit(SET_SELECTED, this.selected);
        this.confirmDialog = true;
      } else {
        this.$store.commit(SET_SNACK, {
          snackbar: true,
          text: "You must select a client for each selected task",
          timeout: 6000,
          color: "error",
          bottom: true
        });
      }
    },
    async generate() {
      let invoiceMap = {};
      let successful = 0;
      let date = new Date();
      this.selected.forEach(task => {
        if (Object.prototype.hasOwnProperty.call(invoiceMap, task.client)) {
          invoiceMap[task.client].tasks.push(task);
        } else {
          invoiceMap[task.client] = {
            tasks: [task]
          };
        }
      });

      for (const invoice in invoiceMap) {
        const request = {
          invoice: {
            customerid: invoice,
            create_date: this.$options.filters.freshbooksDate(date),
            due_offset_days: 30,
            lines: []
          }
        };
        invoiceMap[invoice].tasks.forEach(task => {
          let description = "";
          if (task.includeProjectName) {
            description += task.project + " - ";
          }
          description += task.name;
          let time = Number.parseInt(task.time);
          request.invoice.lines.push({
            type: "0",
            name: "Web Development",
            description: description,
            unit_cost: {
              amount: 100
            },
            qty: isNaN(time) ? 0 : time / 3600000
          });
        });
        let response = await freshbooksService.createInvoice(request);
        if (response.invoice) {
          for (let i = 0; i < invoiceMap[invoice].tasks.length; i++) {
            response = await clickupService.updateTask(
              invoiceMap[invoice].tasks[i].id,
              {
                status: "closed"
              }
            );
            successful++;
          }
        }
        if (successful > 0) {
          await this.success(successful);
        }
      }
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tasks[this.editedIndex], this.editedItem);
      } else {
        console.log("error");
      }
      this.close();
    },
    setDefaults() {
      this.tasks.forEach(task => {
        const setting = this.settings.projects.find(
          project => project.name === task.project
        );
        if (setting) {
          task = Object.assign(task, {
            client: setting.client_id,
            includeProjectName: setting.includeProjects
          });
        }
      });
    },
    async success(successful) {
      await this.$store.dispatch("loadTasks");
      this.confirmDialog = false;
      this.$store.commit(SET_SNACK, {
        snackbar: true,
        text: successful + " tasks were added to invoices successfully.",
        timeout: 6000,
        color: "success",
        bottom: true
      });
      this.selected = [];
    }
  },
  name: "TaskView",
  watch: {
    dialog(val) {
      val || this.close();
    },
    loading(val) {
      if (!val) {
        this.setDefaults();
      }
    }
  }
};
</script>

<style scoped></style>
