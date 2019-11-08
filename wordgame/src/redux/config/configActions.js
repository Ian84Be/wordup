import { LOAD_DICTIONARY, MAKE_BOARD } from '../rootActions';

export const loadDictionary = dictionary => {
  return { type: LOAD_DICTIONARY, payload: dictionary };
};

export const makeBoard = gameBoard => {
  return { type: MAKE_BOARD, payload: gameBoard };
};
