import { formatFreshbooksDate } from "./functions";

export class Invoice {
  constructor({ customerid = null, createDate = null }) {
    this.customerid = customerid;
    this.createDate = formatFreshbooksDate(createDate);
    this.due_offset_days = 30;
    this.lines = [];
    this.id = null;
    this.taskIds = [];
  }
}

export class InvoiceLine {
  constructor({ description = "", time = null }) {
    this.description = description;
    this.qty = isNaN(time) ? 0 : time / 3600000;
    this.type = "0";
    this.unit_cost = {
      amount: 100
    };
    this.name = "Web Development";
  }
}

export class ProjectSetting {
  constructor({ client_id = null, name = "" }) {
    this.client_id = client_id;
    this.name = name;
  }
}

export class ClientSetting {
  constructor({ client_id = null, includeProjects = false }) {
    this.client_id = client_id;
    this.includeProjects = includeProjects;
  }
}

export default {
  Invoice,
  InvoiceLine,
  ProjectSetting,
  ClientSetting
};
