export const asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const clone = ob => {
  return JSON.parse(JSON.stringify(ob));
};

export default {
  asyncForEach,
  clone
};
