export const asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const clone = ob => {
  return JSON.parse(JSON.stringify(ob));
};

export const convertClassesToNativeObjects = objArray => {
  return objArray.map(obj => Object.assign({}, obj));
};

export const formatFreshbooksDate = date => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date
    .getDate()
    .toString()
    .padStart(2, "0");

  return year + "-" + month + "-" + day;
};

export default {
  asyncForEach,
  clone,
  convertClassesToNativeObjects,
  formatFreshbooksDate
};
