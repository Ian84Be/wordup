import {
  ADD_HISTORY,
  ADD_PASSCOUNT,
  ADD_PLAYERS,
  ADD_SCORE,
  CHANGE_MYLETTERS,
  END_GAME,
  NEXT_PLAYER,
  SET_ACTIVEPLAYER
} from '../rootActions';

export const addHistory = words => {
  return { type: ADD_HISTORY, payload: words };
};

export const addPassCount = passCount => {
  return { type: ADD_PASSCOUNT, payload: passCount };
};

export const addPlayers = players => {
  return { type: ADD_PLAYERS, payload: players };
};

export const addScore = score => {
  return { type: ADD_SCORE, payload: score };
};

export const changeMyLetters = letters => {
  return { type: CHANGE_MYLETTERS, payload: letters };
};

export const changePlayer = () => {
  return { type: NEXT_PLAYER };
};
export const signalEndGame = () => {
  return { type: END_GAME };
};

export const setActivePlayer = num => {
  return { type: SET_ACTIVEPLAYER, payload: num };
};
