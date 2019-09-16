export const ERR_MSG = 'ERR_MSG';
export const newErrMsg = err => {
  return { type: ERR_MSG, payload: err };
};

export const GAME_HISTORY = 'GAME_HISTORY';
export const newGameHistory = history => {
  return { type: GAME_HISTORY, payload: history };
};

export const NEW_MESSAGE = 'NEW_MESSAGE';
export const newMessage = message => {
  return { type: NEW_MESSAGE, payload: message };
};
