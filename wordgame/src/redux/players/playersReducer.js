import {
  ADD_HISTORY,
  ADD_PLAYERS,
  ADD_SCORE,
  CHANGE_MYLETTERS,
  NEXT_PLAYER
} from './playersActions';

const initialState = {
  activePlayer: 0,
  players: []
};

const playersReducer = (state = initialState, action) => {
  const { payload, type } = action;
  const { activePlayer, players } = state;
  switch (type) {
    case ADD_HISTORY:
      let historyState = [...players];
      historyState[activePlayer].myHistory.unshift(...payload);
      return {
        ...state,
        players: historyState
      };
    case ADD_SCORE:
      let scoreState = [...players];
      scoreState[activePlayer].myScore += payload;
      return {
        ...state,
        players: scoreState
      };
    case ADD_PLAYERS:
      return {
        ...state,
        players: payload
      };
    case CHANGE_MYLETTERS:
      let letterState = [...players];
      letterState[activePlayer].myLetters = payload;
      return {
        ...state,
        players: letterState
      };
    case NEXT_PLAYER:
      let last = players.length - 1;
      let next = activePlayer;
      if (activePlayer === last) next = 0;
      else ++next;
      return {
        ...state,
        activePlayer: next
      };
    default:
      return state;
  }
};
export default playersReducer;
