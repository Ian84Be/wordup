export const ADD_SCORE = 'ADD_SCORE';
export const addScore = (score) => {
	return ({type: ADD_SCORE, payload: score})
}

export const ADD_PASSCOUNT = 'ADD_PASSCOUNT';
export const addPassCount = (passCount) => {
	return ({type: ADD_PASSCOUNT, payload: passCount})
}