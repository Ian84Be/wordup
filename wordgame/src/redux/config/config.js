import { LOAD_DICTIONARY, MAKE_BOARD } from '../rootActions';

const initialState = {
  dictionary: [],
  gameBoard: []
};

const configReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case LOAD_DICTIONARY:
      return {
        ...state,
        dictionary: payload
      };
    case MAKE_BOARD:
      return {
        ...state,
        gameBoard: payload
      };
    default:
      return state;
  }
};
export default configReducer;
