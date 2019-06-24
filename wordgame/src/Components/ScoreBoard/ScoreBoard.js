import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
      <h1>WordUp</h1>

      <div className="History">
        <div className="countDown">{Object.values(props.letterBag).reduce((a,b)=>a+b)}<p>letters remaining</p></div>
        {/* <h3>SCOREBOARD</h3> */}
        
        
        
        {props.players.map(player => {
          return (
            <div key={player.id} className={player.id === props.activePlayer ? 'active historyCard' : 'historyCard'}>

              <div className="name">{player.myName}: {(player.myScore === 0) ? '0' : player.myScore}</div>
            
              <ul className="history">{player.myHistory.map((word,i) => {
                let thisId = i * Math.random();
                return (
                  <li key={thisId}>{word}</li>
                )
              })}</ul>

            </div>
          )
        })}
    </div>
    
    </div>
  );
}
 
export default ScoreBoard;