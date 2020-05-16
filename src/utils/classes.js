export class ProjectSetting {
  constructor({ client_id = null, includeProjects = false, name = "" }) {
    this.client_id = client_id;
    this.includeProjects = includeProjects;
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
  ProjectSetting
  ClientSetting
};
