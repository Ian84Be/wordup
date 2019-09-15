
export const LOAD_DICTIONARY = 'LOAD_DICTIONARY';
export const loadDictionary = (dictionary) => {
	return ({type: LOAD_DICTIONARY, payload: dictionary})
}

export const MAKE_BOARD = 'MAKE_BOARD';
export const makeBoard = (gameBoard) => {
	return ({type: MAKE_BOARD, payload: gameBoard})
}