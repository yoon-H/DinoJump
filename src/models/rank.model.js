const ranks = [];

const MAX_LEN = 5;

export const createRanks = () => {
  ranks = [];
};

export const getRanks = () => {
  return ranks;
};

export const getHighScore = () => {
  return ranks[0];
};

export const setRanks = (uuid, score, timestamp) => {
  ranks.push({ uuid, score, timestamp });
  ranks.sort((a, b) => b.score - a.score);

  if (ranks.length > MAX_LEN) ranks.pop();

  return { uuid, score, timestamp };
};

export const clearRanks = () => {
  return (ranks = []);
};
