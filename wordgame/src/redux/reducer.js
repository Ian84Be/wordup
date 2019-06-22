
import { 
    ADD_HISTORY,
    ADD_PLAYERS, 
    ADD_SCORE,
    CHANGE_MYLETTERS, 
    HOLD_LETTER,
    LOAD_DICTIONARY, 
    MAKE_BOARD, 
    NEW_LETTERBAG,
    NEW_MESSAGE,
    NEXT_PLAYER 
} from './actions';

import {letterBag} from '../letterBag.js';

const initialState = {
    activePlayer: 0,
    clickedLetter: [],
    dictionary: [],
    gameBoard: [],
    letterBag: letterBag,
    message: '',
    players: []
};

const reducer = (state = initialState, action) => {
    const {payload, type} = action;
    const {activePlayer, players} = state;
    switch (type) {
        case ADD_HISTORY:
            let historyState = [...players];
            historyState[activePlayer].myHistory.unshift(...payload);
            return {
                ...state,
                players: historyState
        }
        case ADD_PLAYERS:
            return {
                ...state,
                players: payload
            }
        case ADD_SCORE:
            let scoreState = [...players];
            scoreState[activePlayer].myScore += payload;
            return {
                ...state,
                players: scoreState
            }
        case CHANGE_MYLETTERS:
            let letterState = [...players];
            letterState[activePlayer].myLetters = payload;
            return {
                ...state,
                players: letterState
            }
        case HOLD_LETTER:
            return {
                ...state,
                clickedLetter: payload
            }
        case LOAD_DICTIONARY:
            return {
                ...state,
                dictionary: payload
            }
        case MAKE_BOARD:
            return {
                ...state,
                gameBoard: payload
            }
        case NEW_MESSAGE:
            return {
                ...state,
                message: payload
            }
        case NEW_LETTERBAG:
            return {
                ...state,
                letterBag: payload
            }
        case NEXT_PLAYER:
            let last = players.length-1;
            let next = activePlayer;
            if (activePlayer === last) next = 0;
            else ++next;
            return {
                ...state,
                activePlayer: next
            }
        default: return state;
    }
}
export default reducer;