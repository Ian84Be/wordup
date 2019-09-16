export const ADD_HISTORY = 'ADD_HISTORY';
export const addHistory = words => {
  return { type: ADD_HISTORY, payload: words };
};

export const ADD_PLAYERS = 'ADD_PLAYERS';
export const addPlayers = players => {
  return { type: ADD_PLAYERS, payload: players };
};

export const ADD_SCORE = 'ADD_SCORE';
export const addScore = score => {
  return { type: ADD_SCORE, payload: score };
};

export const CHANGE_MYLETTERS = 'CHANGE_MYLETTERS';
export const changeMyLetters = letters => {
  return { type: CHANGE_MYLETTERS, payload: letters };
};

export const NEXT_PLAYER = 'NEXT_PLAYER';
export const nextPlayer = () => {
  return { type: NEXT_PLAYER };
};
