
export const ADD_HISTORY = 'ADD_HISTORY';
export const ADD_PASSCOUNT = 'ADD_PASSCOUNT';
export const ADD_PLAYERS = 'ADD_PLAYERS';
export const ADD_SCORE = 'ADD_SCORE';
export const CHANGE_MYLETTERS = 'CHANGE_MYLETTERS';
export const HOLD_LETTER = 'HOLD_LETTER';
export const LOAD_DICTIONARY = 'LOAD_DICTIONARY';
export const MAKE_BOARD = 'MAKE_BOARD';
export const NEW_LETTERBAG = 'NEW_LETTERBAG';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEXT_PLAYER = 'NEXT_PLAYER';

export const addHistory = (words) => {
    return ({type: ADD_HISTORY, payload: words})
}

export const addPassCount = (passCount) => {
    return ({type: ADD_PASSCOUNT, payload: passCount})
}

export const addPlayers = (players) => {
    return ({type: ADD_PLAYERS, payload: players})
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
export const newLetterBag = (letterBag) => {
    return ({type: NEW_LETTERBAG, payload: letterBag})
}

export const nextPlayer = () => {
    return ({type: NEXT_PLAYER})
}
