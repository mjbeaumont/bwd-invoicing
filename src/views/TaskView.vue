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
          <template v-slot:item.client="{ item }">
            {{ getClientName(item.client) }}
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
import { dispatch, get } from "vuex-pathify";
import freshbooksService from "../utils/freshbooks-service";
import clickupService from "../utils/clickup-service";
import template from "../utils/template";
export default {
  computed: {
    clients: get("client/clients"),
    projectSettings: get("setting/projects"),
    loading: get("loading"),
    tasks() {
      return this.$store.get("task/tasks").map(task => {
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
      confirmDialog: false,
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
    getClientName(id) {
      return id
        ? this.$store.getters["client/clientName"](id)
        : "None selected";
    },
    confirm() {
      const valid = this.selected.every(task => task.client);
      if (valid) {
        this.$store.set("task/selected", this.selected);
        this.confirmDialog = true;
      } else {
        this.$store.set("snack/snack", {
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
    setDefaults() {
      this.tasks.forEach(task => {
        const setting = this.projectSettings.find(
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
      await dispatch("task/loadTasks");
      this.confirmDialog = false;
      this.$store.set("snack/snack", {
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
    loading(val) {
      if (!val) {
        this.setDefaults();
      }
    }
  }
};
</script>

<style scoped></style>
