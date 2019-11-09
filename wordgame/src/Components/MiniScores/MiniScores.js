import React from 'react';
import { useSelector } from 'react-redux';

const MiniScores = () => {
  const activePlayer = useSelector(s => s.players.activePlayer);
  const players = useSelector(s => s.players.players);
  return (
    <div className="MiniScores">
      {players.map(player => {
        return (
          <div
            key={player.id}
            className={
              player.id === activePlayer ? 'active playerCard' : 'playerCard'
            }
          >
            {player.myName}: {player.myScore === 0 ? '0' : player.myScore}
          </div>
        );
      })}
    </div>
  );
};

export default MiniScores;
