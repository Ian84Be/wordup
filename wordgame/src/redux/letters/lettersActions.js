import { HOLD_LETTER, NEW_LETTERBAG } from '../rootActions';

export const holdLetter = letter => {
  return { type: HOLD_LETTER, payload: letter };
};

export const newLetterBag = letterBag => {
  return { type: NEW_LETTERBAG, payload: letterBag };
};
