const objectToQueryString = obj => {
  return Object.keys(obj)
    .map(key => key + "=" + obj[key])
    .join("&");
};

const get = (url, params, request) => {
  return request(url, params, "GET");
};

const create = (url, params, request) => {
  return request(url, params, "POST");
};

const update = (url, params, request) => {
  return request(url, params, "PUT");
};

const remove = (url, params, request) => {
  return request(url, params, "DELETE");
};

export default {
  get,
  create,
  update,
  remove,
  objectToQueryString
};
