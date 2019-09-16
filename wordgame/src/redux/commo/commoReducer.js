import { ERR_MSG, GAME_HISTORY, NEW_MESSAGE } from './commoActions';

const initialState = {
  errMsg: '',
  gameHistory: [],
  message: ''
};

const commoReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ERR_MSG: {
      return {
        ...state,
        errMsg: payload
      };
    }
    case GAME_HISTORY:
      return {
        ...state,
        gameHistory: [payload, ...state.gameHistory]
      };
    case NEW_MESSAGE:
      return {
        ...state,
        message: payload
      };
    default:
      return state;
  }
};
export default commoReducer;
