import {
  ADD_HISTORY,
  ADD_PLAYERS,
  ADD_SCORE,
  CHANGE_MYLETTERS,
  NEXT_PLAYER
} from '../rootActions';

export const addHistory = words => {
  return { type: ADD_HISTORY, payload: words };
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

export const nextPlayer = () => {
  return { type: NEXT_PLAYER };
};
