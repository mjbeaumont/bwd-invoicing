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
        :loading="buttonLoading"
        :disabled="buttonLoading"
        ><v-icon>mdi-receipt</v-icon></v-btn
      >
    </v-fab-transition>
  </v-container></template
>

<script>
import { get, commit, dispatch } from "vuex-pathify";
import { Invoice, InvoiceLine } from "../utils/classes";
export default {
  computed: {
    clients: get("client/clients"),
    projectSettings: get("setting/projects"),
    clientSettings: get("setting/clients"),
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
      ],
      buttonLoading: false
    };
  },
  methods: {
    getClientName(id) {
      return id ? this.$store.get("client/clientName", id) : "None selected";
    },
    confirm() {
      const valid = this.selected.every(task => task.client);
      if (valid) {
        this.generate();
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
      let invoices = [];
      let existing;
      this.selected.forEach(task => {
        let invoice = invoices.find(i => i.customerid === task.client);
        if (!invoice) {
          invoice = new Invoice({
            customerid: Number.parseInt(task.client),
            create_date: new Date()
          });
          invoices.push(invoice);
        }
        invoice.lines.push(
          new InvoiceLine({
            description: this.getLineItemName(task),
            time: Number.parseInt(task.time)
          })
        );
        invoice.taskIds.push(task.id);
      });

      await this.loadExistingInvoices();

      invoices.forEach(invoice => {
        existing = this.$store.get(
          "invoice/getExistingInvoices",
          invoice.customerid
        );
        if (existing) {
          invoice.id = existing[0].id;
        }
        commit("invoice/ADD_INVOICE", invoice);
      });

      await this.$router.push("invoices");
    },
    getLineItemName(task) {
      let description = "";
      if (task.includeProjectName) {
        description += task.project + " - ";
      }
      description += task.name;
      return description;
    },
    async loadExistingInvoices() {
      this.buttonLoading = true;
      await dispatch("invoice/loadExistingInvoices");
      this.buttonLoading = false;
    },
    setDefaults() {
      this.tasks.forEach(task => {
        const projectSetting = this.projectSettings.find(
          project => project.name === task.project
        );

        if (projectSetting) {
          const clientSetting = this.clientSettings.find(
            client => client.client_id === projectSetting.client_id
          );

          task = Object.assign(task, {
            client: projectSetting.client_id,
            includeProjectName: clientSetting
              ? clientSetting.includeProjects
              : false
          });
        }
      });
    }
  },
  name: "TaskView",
  watch: {
    loading(val) {
      if (!val) {
        this.setDefaults();
      }
    },
    projectSettings: {
      deep: true,
      handler() {
        this.setDefaults();
      }
    }
  }
};
</script>

<style scoped></style>
