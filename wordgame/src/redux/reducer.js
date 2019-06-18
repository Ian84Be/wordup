
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
        myLetters: [],
        myName: 'playerOne',
        myScore: 0,
      },
      {
        id: 1,
        myHistory: [],
        myLetters: [],
        myName: 'playerTwo',
        myScore: 0,
      },
    ]
};

const reducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
        case ADD_HISTORY:
            console.log('ADDHISTORY',payload)
            let historyState = {...state}
            historyState.players[historyState.activePlayer].myHistory.unshift(payload);
            return {
                ...historyState,
        }
        case ADD_PLAYER:
            return {
                ...state,
                players: [...state.players, payload]
            }
        case ADD_SCORE:
            console.log('ADDSCORE',payload)
            let scoreState = {...state}
            scoreState.players[scoreState.activePlayer].myScore += payload;
            return {
                ...scoreState,
            }
        case CHANGE_MYLETTERS:
            console.log('CHANGE_MYLETTERS',payload);
            let letterState = {...state};
            letterState.players[letterState.activePlayer].myLetters = payload;
            return {
                ...letterState
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
            console.log('MAKEBOARD')
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
            let last = state.players.length-1;
            let next = state.activePlayer;
            if (state.activePlayer === last) {
                next = 0;
            } else ++next;
            return {
                ...state,
                activePlayer: next
            }
        default: return state;
    }
}
export default reducer;