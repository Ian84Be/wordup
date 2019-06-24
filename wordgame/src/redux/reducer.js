
import { 
    ADD_HISTORY,
    ADD_PASSCOUNT, 
    ADD_PLAYERS, 
    ADD_SCORE,
    ERR_MSG,
    CHANGE_MYLETTERS, 
    GAME_HISTORY,
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
        case ADD_PASSCOUNT:
            return {
                ...state,
                passCount: payload
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
        case ERR_MSG: {
            return {
                ...state,
                errMsg: payload
            }
        }
        case GAME_HISTORY:
            return {
                ...state,
                gameHistory: [payload, ...state.gameHistory]
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
            if (Object.values(payload).reduce((a,b)=>a+b) === 0) {
                return {
                    ...state,
                    emptyBag: true,
                    letterBag: payload
                }
            }
            else return {
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