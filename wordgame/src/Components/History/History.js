import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newGameHistory } from '../../redux/commo/commoActions';
import { useLocalStorage } from '../../useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const History = ({ showHistory }) => {
  const [l_gameHistory] = useLocalStorage('gameHistory', '');

  const dispatch = useDispatch();
  const gameHistory = useSelector(s => s.commo.gameHistory);

  const [showing, setShowing] = useState([]);

  useEffect(() => {
    if (l_gameHistory.length > 0 && gameHistory.length < l_gameHistory.length) {
      setShowing(l_gameHistory);
      dispatch(newGameHistory(l_gameHistory));
    } else {
      setShowing(gameHistory);
    }
  }, [dispatch, gameHistory, l_gameHistory]);
  return (
    <>
      <span className="Modal" onClick={() => showHistory(false)}></span>
      <div className="History--wrapper">
        <span className="icon--wrapper" onClick={() => showHistory(false)}>
          <FontAwesomeIcon icon={faTimesCircle} size="2x" />
        </span>

        <section className="History--body">
          <h2>History</h2>
          {showing.length > 0 && (
            <div className="History--line-container">
              {showing.map((turn, i) => {
                return (
                  <div key={i} className="History--line">
                    {turn}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default History;
