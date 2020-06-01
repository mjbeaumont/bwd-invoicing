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
      <v-container v-if="getExistingInvoicesCount(invoice.customerid)">
        <v-row>
          <v-col cols="4"
            ><v-select
              light
              :items="getExistingInvoices(invoice.customerid)"
              :value="invoice.id"
              solo
              label="Destination"
              @input="v => updateInvoice(v, index)"
            ></v-select
          ></v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="remove(index)" color="secondary"
          ><v-icon>mdi-delete</v-icon> Delete</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-btn @click="generate" color="primary" :loading="loading">Generate</v-btn>
  </v-container>
</template>

<script>
import { get, sync, commit, dispatch } from "vuex-pathify";
import freshbooksService from "../utils/freshbooks-service";
import clickupService from "../utils/clickup-service";
import { clone } from "../utils/functions";
import { InvoiceLine } from "../utils/classes";
export default {
  created() {
    if (!this.invoices.length) {
      this.$router.push("tasks");
    }
  },
  computed: {
    invoices: get("invoice/invoices"),
    loading: sync("loading")
  },
  methods: {
    async generate() {
      this.loading = true;
      let successful = {
        invoices: 0,
        tasks: 0
      };
      for (let i = 0; i <= this.invoices.length; i++) {
        // eslint-disable-next-line no-unused-vars
        let { id, taskIds, ...request } = this.invoices[i];
        let response;
        request = { invoice: clone(request) };
        if (id) {
          const existingLines = this.getExistingLines(id);
          request.invoice.lines = request.invoice.lines.concat(existingLines);
          console.log(request);
          response = await freshbooksService.updateInvoice(request, id);
        } else {
          response = await freshbooksService.createInvoice(request);
        }
        console.log(response.invoice);
        if (response.invoice) {
          for (let j = 0; j < taskIds.length; j++) {
            response = await clickupService.updateTask(taskIds[j], {
              status: "closed"
            });
            console.log(response);
            console.log(taskIds[j]);
            successful.tasks++;
          }
          successful.invoices++;
        }
        this.loading = false;
        if (successful.invoices > 0) {
          await this.success(successful);
        }
      }
    },
    getClientName(id) {
      return this.$store.get("client/clientName", id);
    },
    getExistingLines(id) {
      const lines = [];
      const invoice = this.$store
        .get("invoice/existing")
        .find(invoice => invoice.id === id);
      invoice.lines.forEach(line => {
        lines.push(
          clone(
            new InvoiceLine({
              description: line.description,
              time: line.qty * 3600000 // reverse this
            })
          )
        );
      });

      return lines;
    },
    getInvoiceTotal(invoice) {
      return invoice.lines.reduce(
        (carry, lineItem) => carry + lineItem.qty * lineItem.unit_cost.amount,
        0
      );
    },
    getExistingInvoices(clientId) {
      let invoices = [{ value: null, text: "Create new invoice" }];
      invoices = invoices.concat(
        this.$store
          .get("invoice/getExistingInvoices", clientId)
          .map(invoice => {
            return {
              value: invoice.id,
              text: "Add to existing invoice #" + invoice.invoice_number
            };
          })
      );

      return invoices;
    },
    getExistingInvoicesCount(clientId) {
      return this.$store.get("invoice/getExistingInvoices", clientId).length;
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
    },
    updateInvoice(value, index) {
      const path = "invoice/invoices@[" + index + "].id";
      this.$store.set(path, value);
    }
  },
  name: "InvoiceView.vue",
  watch: {
    invoices(val) {
      if (!val.length) {
        this.$router.push("tasks");
      }
    }
  }
};
</script>

<style scoped></style>
