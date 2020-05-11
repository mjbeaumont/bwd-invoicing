import { store } from "./../store/index";
import { SET_SNACK } from "../store/mutation-types";
import apiService from "./api-service";

const _apiHost = "https://api.clickup.com/api/v2";
const _proxyUrl = "https://cors.beaumontwebdev.com:4856/";

async function request(url, params, method = "get") {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    store.state.setting.settings.clickup.auth_key
  );

  const options = {
    method,
    headers: myHeaders
  };

  if (params) {
    if (method === "GET") {
      url += "?" + apiService.objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }
  }

  const response = await fetch(_proxyUrl + _apiHost + url, options);

  if (response.status !== 200) {
    store.commit(SET_SNACK, {
      snackbar: true,
      text:
        "Clickup Error: " + response.status + "(" + response.statusText + ")",
      timeout: 6000,
      color: "error",
      bottom: true
    });
  }
  const result = await response.json();

  return result;
}

async function getTasks(search) {
  return await apiService.get(
    "/team/" + store.state.setting.settings.clickup.team_id + "/task",
    search,
    request
  );
}

async function updateTask(id, data) {
  return await apiService.update("/task/" + id, data, request);
}

async function getFolders(search) {
  return await apiService.get(
    "/space/" + store.state.setting.settings.clickup.space_id + "/folder",
    search,
    request
  );
}

export default { getTasks, getFolders, updateTask };
