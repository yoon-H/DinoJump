import { CLIENT_VERSION } from './Constants.js';
import { initData } from './Data.js';
import { itemController } from './index.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);

  switch(data.id) {
    case 'gameAssets' :
      const { gameAssets } = data;

      initData(gameAssets);
      break;
    case 'moveStage' :
      const {stageIdx} = data;

      itemController.setUnlockedId(stageIdx);
      break;
    default :
      break;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
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
