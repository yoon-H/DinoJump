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

export const getStageItemScore = (uuid, stage) => {
  const items = getItems(uuid);

  const curItems = items.filter((item) => (item.stageId = stage));

  if (!curItems) return 0;
  else {
    const totalScore = curItems.reduce((acc, item) => (acc += item.score), 0);
    return totalScore;
  }
};

export const getTotalItemScore = (uuid) => {
  const items = getItems(uuid);

  if (!items) return 0;
  else {
    const totalScore = items.reduce((acc, item) => (acc += item.score), 0);
    return totalScore;
  }
};
