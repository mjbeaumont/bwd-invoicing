export const snack = () => {
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

export const lineItem = () => {
  return {
    id: null,
    project: "",
    name: "",
    time: 0,
    client: 0,
    includeProjectName: false
  };
};

export const settings = () => {
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

export default {
  snack,
  lineItem,
  settings
};
