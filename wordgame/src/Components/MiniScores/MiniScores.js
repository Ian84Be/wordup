import React from 'react';

const MiniScores = (props) => {
  return (
    <div className="MiniScores">
      
      {props.players.map(player => {
        return (
          <div key={player.id} className={player.id === props.activePlayer ? 'active playerCard' : 'playerCard'}>
          {player.myName}: {(player.myScore === 0) ? '0' : player.myScore}
          </div>
        )
      })}

    </div>
  );
}
 
export default MiniScores;