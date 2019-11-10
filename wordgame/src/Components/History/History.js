import React from 'react';
import { useSelector } from 'react-redux';

const History = ({ showHistory }) => {
  const gameHistory = useSelector(s => s.commo.gameHistory);
  return (
    <>
      <span className="Modal" onClick={() => showHistory(false)}></span>
      <section className="History">
        <h2>History</h2>
        <div className="History--line-container">
          {gameHistory.map((turn, i) => {
            return (
              <div key={i + Math.random()} className="History--line">
                {turn}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default History;
