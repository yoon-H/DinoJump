const items = {};

export const createItems = (uuid) => {
  items[uuid] = [];
};

export const getItems = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, stageId, id, score, timestamp) => {
  return items[uuid].push({ stageId, id, score, timestamp });
};

export const clearItems = (uuid) => {
  return (items[uuid] = []);
};
