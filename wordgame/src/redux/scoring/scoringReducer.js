import { ADD_PASSCOUNT, GAME_HISTORY } from './actions';

import { letterBag } from '../letterBag.js';

const initialState = {
  activePlayer: 0,
  clickedLetter: [],
  dictionary: [],
  emptyBag: false,
  errMsg: '',
  gameBoard: [],
  gameHistory: [],
  letterBag: letterBag,
  message: '',
  passCount: 0,
  players: []
};

const scoringReducer = (state = initialState, action) => {
  const { payload, type } = action;
  const { activePlayer, players } = state;
  switch (type) {
    case ADD_PASSCOUNT:
      return {
        ...state,
        passCount: payload
      };

    case GAME_HISTORY:
      return {
        ...state,
        gameHistory: [payload, ...state.gameHistory]
      };
    default:
      return state;
  }
};
export default scoringReducer;
