import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import { addUser, getUser } from '../models/user.model.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    //서버에 있는 모든 유저 대상

    let userId = socket.handshake.query.userId; // 연결 시 쿼리에서 유저 아이디 받기
    console.log('User ID:', userId);

    if (!userId) userId = uuidv4();
    const user = getUser().find((item) => item.uuid === userId);
    
    if(!user) addUser({ uuid: userId, socketId: socket.id });

    handleConnection(socket, userId);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    //접속 해제시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userId));
  });
};

export default registerHandler;
