import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import { createItems } from '../models/item.model.js';
import { getHighScore } from '../models/rank.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', getUser());

  createStage(uuid);
  createItems(uuid);

  const rank = getHighScore();

  socket.emit('connection', { uuid, highRecord: rank || '' });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', mesage: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  if (response.broadcast) {
    io.emit('response', response);
    return;
  }

  socket.emit('response', response);
};
