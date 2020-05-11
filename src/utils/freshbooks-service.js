import { store } from "./../store/index";
import apiService from "./api-service";

const _apiHost = "https://api.freshbooks.com/";
const _proxyUrl = "https://cors.beaumontwebdev.com:4856/";

async function request(url, params, method = "get") {
  let access_token;

  // refresh the access token if it is expiring in one hour or less
  if (
    store.get("setting.settings@freshbooks.expires") <
    Math.round(new Date().getTime() / 1000)
  ) {
    access_token = await refreshToken();
  } else {
    access_token = store.get("setting.settings@freshbooks.access_token");
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
      url += "?" + apiService.objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }
  }

  const response = await fetch(_proxyUrl + _apiHost + url, options);

  if (response.status !== 200) {
    store.set("snack/snack", {
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

async function createInvoice(data) {
  return await apiService.create(
    "accounting/account/" +
      store.get("setting.settings@freshbooks.account_id") +
      "/invoices/invoices",
    data,
    request
  );
}

async function getClients(search) {
  return await apiService.get(
    "/accounting/account/" +
      store.get("setting.settings@freshbooks.account_id") +
      "/users/clients",
    search,
    request
  );
}

async function refreshToken() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const response = await fetch(_apiHost + "auth/oauth/token", {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_secret: store.get("setting.settings@freshbooks.client_secret"),
      client_id: store.get("setting.settings@freshbooks.client_id"),
      refresh_token: store.get("setting.settings@freshbooks.refresh_token"),
      redirect_uri: store.get("setting.settings@freshbooks.redirect_uri")
    })
  });

  const result = await response.json();
  const val = {
    freshbooks: {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires: result.expires_in + result.created_at
    }
  };
  await store.dispatch("setting/updateSettings", {
    val: val,
    mergeType: "merge"
  });

  return result.access_token;
}

export default {
  createInvoice,
  getClients
};
