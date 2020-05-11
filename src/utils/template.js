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

export default {
  snack,
  lineItem
};
