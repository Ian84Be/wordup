
import { 
    ADD_HISTORY,
    ADD_PLAYER, 
    ADD_SCORE,
    CHANGE_MYLETTERS, 
    HOLD_LETTER,
    LOAD_DICTIONARY, 
    MAKE_BOARD, 
    NEW_MESSAGE,
    NEXT_PLAYER 
} from './actions';

import {drawLetters} from '../Components/PlayerOne/PlayerOne';

const initialState = {
    activePlayer: 0,
    clickedLetter:[],
    dictionary:[],
    gameBoard:[],
    message: '',
    players: [
      {
        id: 0,
        myHistory: [],
        myLetters: drawLetters(8),
        myName: 'Steve',
        myScore: 0,
      },
      {
        id: 1,
        myHistory: [],
        myLetters: drawLetters(8),
        myName: 'Dave',
        myScore: 0,
      },
    ]
};

const reducer = (state = initialState, action) => {
    const {payload, type} = action;
    const {activePlayer, players} = state;
    switch (type) {
        case ADD_HISTORY:
            console.log('ADDHISTORY',payload);
            let historyState = [...players];
            historyState[activePlayer].myHistory.unshift(...payload);
            return {
                ...state,
                players: historyState
        }
        case ADD_PLAYER:
            return {
                ...state,
                players: [...players, payload]
            }
        case ADD_SCORE:
            console.log('ADDSCORE',payload);
            let scoreState = [...players];
            scoreState[activePlayer].myScore += payload;
            return {
                ...state,
                players: scoreState
            }
        case CHANGE_MYLETTERS:
            console.log('CHANGE_MYLETTERS',payload);
            let letterState = [...players];
            letterState[activePlayer].myLetters = payload;
            return {
                ...state,
                players: letterState
            }
        case HOLD_LETTER:
            console.log('HOLD_LETTER',payload);
            return {
                ...state,
                clickedLetter: payload
            }
        case LOAD_DICTIONARY:
            console.log('LOAD_DICTIONARY');
            return {
                ...state,
                dictionary: payload
            }
        case MAKE_BOARD:
            console.log('MAKEBOARD');
            return {
                ...state,
                gameBoard: payload
            }
        case NEW_MESSAGE:
            return {
                ...state,
                message: payload
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