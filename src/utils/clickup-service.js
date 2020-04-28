import { store } from "./../store/index";
import { SET_SNACK } from "../store/mutation-types";

const _apiHost = "https://api.clickup.com/api/v2";
const _proxyUrl = "https://cors.beaumontwebdev.com:4856/";

async function request(url, params, method = "get") {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", store.state.settings.clickup.auth_key);

  const options = {
    method,
    headers: myHeaders
  };

  if (params) {
    if (method === "GET") {
      url += "?" + objectToQueryString(params);
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

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => key + "=" + obj[key])
    .join("&");
}

function get(url, params) {
  return request(url, params);
}

function create(url, params) {
  return request(url, params, "POST");
}

function update(url, params) {
  return request(url, params, "PUT");
}

function remove(url, params) {
  return request(url, params, "DELETE");
}

export default {
  get,
  create,
  update,
  remove
};
