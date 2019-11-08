import { ERR_MSG, GAME_HISTORY, NEW_MESSAGE } from '../rootActions';

export const newErrMsg = err => {
  return { type: ERR_MSG, payload: err };
};

export const newGameHistory = history => {
  return { type: GAME_HISTORY, payload: history };
};

export const newMessage = message => {
  return { type: NEW_MESSAGE, payload: message };
};
