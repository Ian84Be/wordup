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

const reducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
};
export default reducer;
