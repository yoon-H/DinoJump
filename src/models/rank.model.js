const ranks = [];

export const createRanks = () => {
  ranks = [];
};

export const getRanks = () => {
  return ranks;
};

export const setRanks = (uuid, score, timestamp) => {
  return ranks.push({ uuid, score, timestamp });
};

export const clearRanks = () => {
  return (ranks = []);
};
