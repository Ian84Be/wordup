export const ADD_PLAYERS = 'ADD_PLAYERS';
export const addPlayers = (players) => {
	return ({type: ADD_PLAYERS, payload: players})
}

export const NEXT_PLAYER = 'NEXT_PLAYER';
export const nextPlayer = () => {
	return ({type: NEXT_PLAYER})
}