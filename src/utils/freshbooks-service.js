import { store } from "./../store/index";
import apiService from "./api-service";

function getApiHost() {
  return (
    "https://cors.beaumontwebdev.com:4856/" +
    "https://api.freshbooks.com/accounting/account/" +
    store.get("setting/freshbooks@account_id")
  );
}

async function request(url, params, method = "get") {
  let access_token;

  // refresh the access token if it is expiring in one hour or less
  if (
    store.get("setting/freshbooks@expires") <
    Math.round(new Date().getTime() / 1000)
  ) {
    access_token = await refreshToken();
  } else {
    access_token = store.get("setting/freshbooks@access_token");
  }

  if (!access_token) {
    return {};
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

  const response = await fetch(getApiHost() + url, options);

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

async function getInvoice(id) {
  return await apiService.get("invoices/invoices/" + id, null, request);
}

async function createInvoice(data) {
  return await apiService.create("/invoices/invoices", data, request);
}

async function updateInvoice(data, id) {
  return await apiService.update("/invoices/invoices/" + id, data, request);
}

async function getClients(search) {
  return await apiService.get("/users/clients", search, request);
}

async function getInvoices(search) {
  return await apiService.get("/invoices/invoices", search, request);
}

async function refreshToken() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const response = await fetch("https://api.freshbooks.com/auth/oauth/token", {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_secret: store.get("setting/freshbooks@client_secret"),
      client_id: store.get("setting/freshbooks@client_id"),
      refresh_token: store.get("setting/freshbooks@refresh_token"),
      redirect_uri: store.get("setting/freshbooks@redirect_uri")
    })
  });

  if (response.status === 200) {
    const result = await response.json();
    // TODO: find a way to make this less verbose
    store.set("setting/freshbooks@access_token", result.access_token);
    store.set("setting/freshbooks@refresh_token", result.refresh_token);
    store.set(
      "setting/freshbooks@expires",
      result.expires_in + result.created_at
    );

    return result.access_token;
  } else {
    window.location.href = store.get("setting/freshbooks@redirect_uri");
  }
}

export default {
  getInvoice,
  createInvoice,
  updateInvoice,
  getClients,
  getInvoices
};
