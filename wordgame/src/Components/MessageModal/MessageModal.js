import React from 'react';
import { useDispatch } from 'react-redux';
import { newMessage, newErrMsg } from '../../redux/commo/commoActions';

const MessageModal = props => {
  const dispatch = useDispatch();
  return (
    <div className="MessageModal" onClick={clearMsg}>
      <div className="MessageModal--body">
        <p>{props.message}</p>
        <button onClick={clearMsg}>OK</button>
      </div>
    </div>
  );
  function clearMsg() {
    dispatch(newMessage(''));
    dispatch(newErrMsg(''));
  }
};

export default MessageModal;
