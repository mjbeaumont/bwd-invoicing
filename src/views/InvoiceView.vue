<template>
  <v-container>
    <v-card
      v-for="(invoice, index) in invoices"
      :key="index"
      class="mb-4"
      width="75%"
      ><v-card-title>{{ getClientName(invoice.customerid) }}</v-card-title>
      <v-card-subtitle class="display-1"
        >${{ getInvoiceTotal(invoice) }}</v-card-subtitle
      >
      <v-divider></v-divider>
      <v-list-item v-for="line in invoice.lines" :key="line.description">
        <v-list-item-content
          ><v-list-item-title>{{ line.description }}</v-list-item-title>
          <v-list-item-subtitle>{{ line.qty }}h</v-list-item-subtitle>
        </v-list-item-content></v-list-item
      >
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="remove(index)" color="secondary"
          ><v-icon>mdi-delete</v-icon> Delete</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-btn @click="generate" color="primary">Generate</v-btn>
  </v-container>
</template>

<script>
import { get, commit, dispatch } from "vuex-pathify";
//import freshbooksService from "../utils/freshbooks-service";
//import clickupService from "../utils/clickup-service";
import { clone } from "../utils/functions";
export default {
  created() {
    if (!this.invoices.length) {
      this.redirectToTaskView();
    }
  },
  computed: {
    invoices: get("invoice/invoices")
  },
  methods: {
    async generate() {
      let successful = {
        invoices: 0,
        tasks: 0
      };
      for (let i = 0; i <= this.invoices.length; i++) {
        // eslint-disable-next-line no-unused-vars
        let { id, taskIds, ...request } = this.invoices[i];
        request = clone(request);
        //let response = await freshbooksService.createInvoice(request);
        console.log(request);
        let response = {
          invoice: true
        };
        if (response.invoice) {
          for (let j = 0; j < taskIds.length; j++) {
            /*response = await clickupService.updateTask(taskIds[j], {
              status: "closed"
            });*/
            console.log(taskIds[j]);
            successful.tasks++;
          }
          successful.invoices++;
        }
        if (successful.invoices > 0) {
          await this.success(successful);
        }
      }
    },
    getClientName(id) {
      return this.$store.getters["client/clientName"](id);
    },
    getInvoiceTotal(invoice) {
      return invoice.lines.reduce(
        (carry, lineItem) => carry + lineItem.qty * lineItem.unit_cost.amount,
        0
      );
    },
    redirectToTaskView() {
      this.$router.push("tasks");
    },
    remove(index) {
      commit("invoice/REMOVE_INVOICE", index);
    },
    async success(successful) {
      await dispatch("task/loadTasks");
      this.$store.set("snack/snack", {
        snackbar: true,
        text:
          successful.invoices +
          " invoices and " +
          successful.tasks +
          " tasks were generated successfully.",
        timeout: 6000,
        color: "success",
        bottom: true
      });
      await commit("invoice/SET_INVOICES", []);
    }
  },
  name: "InvoiceView.vue",
  watch: {
    invoices(val) {
      if (!val.length) {
        this.redirectToTaskView();
      }
    }
  }
};
</script>

<style scoped></style>
