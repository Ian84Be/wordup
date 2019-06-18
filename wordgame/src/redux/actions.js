
export const ADD_PLAYER = 'ADD_PLAYER';

export const addPlayer = (player) => {
    return ({type: ADD_PLAYER, payload: player})
}