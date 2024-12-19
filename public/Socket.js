import { CLIENT_VERSION } from './Constants.js';
import { initData } from './Data.js';
import { itemController } from './index.js';

const USER_ID_KEY = 'userId';
let userId = localStorage.getItem(USER_ID_KEY);

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userId: userId || '',
  },
});

socket.on('response', (data) => {
  console.log(data);

  switch (data.id) {
    case 'gameAssets':
      const { gameAssets } = data;

      initData(gameAssets);
      break;
    case 'moveStage':
      const { stageIdx } = data;

      itemController.setUnlockedId(stageIdx);
      break;
    case 'highScore':
      const { highScore: rank } = data;
      changeHighScore(rank.highScore);

    default:
      break;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  if (!userId) {
    userId = data.uuid;
    localStorage.setItem(USER_ID_KEY, userId);
  }
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
