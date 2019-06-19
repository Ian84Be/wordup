
export const ADD_HISTORY = 'ADD_HISTORY';
export const ADD_PLAYER = 'ADD_PLAYER';
export const ADD_SCORE = 'ADD_SCORE';
export const CHANGE_MYLETTERS = 'CHANGE_MYLETTERS';
export const HOLD_LETTER = 'HOLD_LETTER';
export const LOAD_DICTIONARY = 'LOAD_DICTIONARY';
export const MAKE_BOARD = 'MAKE_BOARD';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEXT_PLAYER = 'NEXT_PLAYER';

export const addHistory = (words) => {
    return ({type: ADD_HISTORY, payload: words})
}

export const addPlayer = (player) => {
    return ({type: ADD_PLAYER, payload: player})
}

export const addScore = (score) => {
    return ({type: ADD_SCORE, payload: score})
}

export const changeMyLetters = (letters) => {
    return ({type: CHANGE_MYLETTERS, payload: letters})
}

export const holdLetter = (letter) => {
    return ({type: HOLD_LETTER, payload: letter})
}

export const loadDictionary = (dictionary) => {
    return ({type: LOAD_DICTIONARY, payload: dictionary})
}

export const makeBoard = (gameBoard) => {
    return ({type: MAKE_BOARD, payload: gameBoard})
}

export const newMessage = (message) => {
    return ({type: NEW_MESSAGE, payload: message})
}

export const nextPlayer = () => {
    return ({type: NEXT_PLAYER})
}
