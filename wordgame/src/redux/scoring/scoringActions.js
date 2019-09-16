export const ADD_PASSCOUNT = 'ADD_PASSCOUNT';
export const addPassCount = passCount => {
  return { type: ADD_PASSCOUNT, payload: passCount };
};
