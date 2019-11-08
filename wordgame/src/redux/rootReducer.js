import { combineReducers } from 'redux';
import commo from './commo/commo';
import config from './config/config';
import letters from './letters/letters';
import players from './players/players';
import scoring from './scoring/scoring';

// const initialState = {
//   activePlayer: 0,
//   clickedLetter: [],
//   dictionary: [],
//   emptyBag: false,
//   errMsg: '',
//   gameBoard: [],
//   gameHistory: [],
//   letterBag: letterBag,
//   message: '',
//   passCount: 0,
//   players: []
// };

export default combineReducers({
  commo,
  config,
  letters,
  players,
  scoring
});
