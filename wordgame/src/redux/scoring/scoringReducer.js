import { ADD_PASSCOUNT } from './actions';

const initialState = {
  passCount: 0
};

const scoringReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ADD_PASSCOUNT:
      return {
        ...state,
        passCount: payload
      };
    default:
      return state;
  }
};
export default scoringReducer;
