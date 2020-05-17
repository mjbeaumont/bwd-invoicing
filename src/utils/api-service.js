const objectToQueryString = obj => {
  return Object.keys(obj)
    .map(key => {
      const values = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
      return values.map(value => key + "=" + value).join("&");
    })
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
