import { HOLD_LETTER, NEW_LETTERBAG } from '../rootActions';

import { letterBag } from '../../letterBag.js';

const initialState = {
  clickedLetter: [],
  emptyBag: false,
  letterBag: letterBag
};

const lettersReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case HOLD_LETTER:
      return {
        ...state,
        clickedLetter: payload
      };
    case NEW_LETTERBAG:
      if (Object.values(payload).reduce((a, b) => a + b) === 0) {
        return {
          ...state,
          emptyBag: true,
          letterBag: payload
        };
      } else
        return {
          ...state,
          letterBag: payload
        };
    default:
      return state;
  }
};
export default lettersReducer;
