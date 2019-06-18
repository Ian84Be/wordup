
import { ADD_PLAYER } from './actions';

const initialState = {
    clickedLetter:[],
    dictionary:[],
    gameBoard:[],
    message: '',
    players: [
      {
        id: 1,
        history: [],
        letters: [],
        name: 'playerOne',
        score: 0,
      },
    ]
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLAYER:
            return {
                ...state,
                players: [...state.players, action.payload]
            };
        default: return state;
    }
}

export default reducer;