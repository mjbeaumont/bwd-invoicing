import { store } from "./../store/index";
import { SET_SNACK } from "./../store/mutation-types";

const _apiHost = "https://api.freshbooks.com/";
const _proxyUrl = "https://cors-anywhere.herokuapp.com/";

async function request(url, params, method = "get") {
  let access_token;

  // refresh the access token if it is expiring in one hour or less
  if (
    store.state.settings.freshbooks.expires <
    Math.round(new Date().getTime() / 1000)
  ) {
    access_token = await refreshToken();
  } else {
    access_token = store.state.settings.freshbooks.access_token;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + access_token);

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
        "Freshbooks Error: " +
        response.status +
        "(" +
        response.statusText +
        ")",
      timeout: 6000,
      color: "error",
      bottom: true
    });
  }
  const result = await response.json();

  return result.response.result;
}

async function refreshToken() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const response = await fetch(_apiHost + "auth/oauth/token", {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_secret: store.state.settings.freshbooks.client_secret,
      client_id: store.state.settings.freshbooks.client_id,
      refresh_token: store.state.settings.freshbooks.refresh_token,
      redirect_uri: store.state.settings.freshbooks.redirect_uri
    })
  });

  const result = await response.json();
  await store.dispatch("updateSettings", {
    freshbooks: {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires: result.expires_in + result.created_at
    }
  });

  return result.access_token;
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
