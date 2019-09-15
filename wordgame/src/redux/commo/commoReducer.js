import { ERR_MSG, NEW_MESSAGE } from './actions';

const initialState = {
  errMsg: '',
  message: ''
};

const commoReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case ERR_MSG: {
      return {
        ...state,
        errMsg: payload
      };
    }
    case NEW_MESSAGE:
      return {
        ...state,
        message: payload
      };
    default:
      return state;
  }
};
export default commoReducer;
