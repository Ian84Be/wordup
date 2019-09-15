export const CHANGE_MYLETTERS = 'CHANGE_MYLETTERS';
export const changeMyLetters = (letters) => {
	return ({type: CHANGE_MYLETTERS, payload: letters})
}

export const HOLD_LETTER = 'HOLD_LETTER';
export const holdLetter = (letter) => {
	return ({type: HOLD_LETTER, payload: letter})
}

export const NEW_LETTERBAG = 'NEW_LETTERBAG';
export const newLetterBag = (letterBag) => {
	return ({type: NEW_LETTERBAG, payload: letterBag})
}