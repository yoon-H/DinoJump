import { moveStageHandler, getItemHandler } from './stage.handler.js';
import { gameEnd, gameStart, getGameTables } from './game.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  5: getGameTables,
  11: moveStageHandler,
  21: getItemHandler,
};

export default handlerMappings;
