import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
      <h1>WordUp</h1>
      <div className="countDown">{Object.values(props.letterBag).reduce((a,b)=>a+b)} letters remain</div>
      
      {props.players.map(player => {
        return (
          <div key={player.id} className={player.id === props.activePlayer ? 'active playerCard' : 'playerCard'}>

            <div className="name">{player.myName}: {(player.myScore === 0) ? '0' : player.myScore}</div>
          
            {/* <ul className="history">{player.myHistory.map(word => {
              return (
                <li>{word}</li>
              )
            })}</ul> */}

          </div>
        )
      })}

    </div>
  );
}
 
export default ScoreBoard;