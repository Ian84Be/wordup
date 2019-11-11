import React, { useState } from 'react';
import HowTo from './HowTo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const HowToModal = ({ showHowTo }) => {
  const [warning, showWarning] = useState(false);
  return (
    <>
      <span className="Modal" onClick={() => showHowTo(false)}></span>
      <div className="HowToModal--wrapper">
        <span className="icon--wrapper" onClick={() => showHowTo(false)}>
          <FontAwesomeIcon icon={faTimesCircle} size="2x" />
        </span>
        {warning ? (
          <>
            <div className="HowToModal--warning">
              <p>Delete all game data and quit?</p>
              <div className="buttons">
                <button className="YES" onClick={quitGame}>
                  Yes
                </button>
                <button className="NO" onClick={() => showWarning(false)}>
                  No
                </button>
              </div>
            </div>
          </>
        ) : (
          <HowTo />
        )}

        {!warning && (
          <button onClick={() => showWarning(true)}>Quit Game</button>
        )}
      </div>
    </>
  );
};

function quitGame() {
  localStorage.clear();
  window.location.reload();
}

export default HowToModal;
