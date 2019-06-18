
import { 
    ADD_PLAYER, 
    CHANGE_MYLETTERS, 
    HOLD_LETTER,
    LOAD_DICTIONARY, 
    MAKE_BOARD, 
    NEW_MESSAGE 
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
    ]
};

const reducer = (state = initialState, action) => {
    const {payload, type} = action;
    switch (type) {
        case ADD_PLAYER:
            return {
                ...state,
                players: [...state.players, payload]
            }
        case CHANGE_MYLETTERS:
            console.log('CHANGE_MYLETTERS',payload);
            let newState = {...state};
            console.log(newState)
            newState.players[payload.id].myLetters = payload.letters;
            return {
                ...newState
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
        default: return state;
    }
}
export default reducer;