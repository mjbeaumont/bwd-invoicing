const snack = () => {
  return {
    snackbar: false,
    top: null,
    bottom: null,
    left: null,
    right: null,
    timeout: null,
    color: ""
  };
};

const lineItem = () => {
  return {
    id: null,
    project: "",
    name: "",
    time: 0,
    client: 0,
    includeProjectName: false
  };
};

const settings = () => {
  return {
    clickup: {
      auth_key: "",
      space_id: "",
      team_id: ""
    },
    freshbooks: {
      access_token: "",
      account_id: "",
      client_id: "",
      client_secret: "",
      expires: 0,
      redirect_uri: "",
      refresh_token: ""
    },
    projects: [],
    folders: []
  };
};

const projectSetting = () => {
  return {
    client_id: 0,
    includeProjects: false,
    name: ""
  };
};

export default {
  snack,
  lineItem,
  settings,
  projectSetting
};
