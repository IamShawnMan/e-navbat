import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 });

export const getCache = (key) => {
  const result = cache.get(key);

  return result;
};

export const setCache = (key, value) => {
  cache.set(key, value);
};
