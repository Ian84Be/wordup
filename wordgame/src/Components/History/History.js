import React from 'react';

const History = (props) => {
  return (
    <div className="History">
      <h3>HISTORY</h3>
      <div className="countDown"><p>letters remaining</p>{Object.values(props.letterBag).reduce((a,b)=>a+b)}</div>
      
      
      {props.players.map(player => {
        return (
          <div key={player.id} className={player.id === props.activePlayer ? 'active historyCard' : 'historyCard'}>

            <div className="name">{player.myName}: {(player.myScore === 0) ? '0' : player.myScore}</div>
          
            <ul className="history">{player.myHistory.map(word => {
              return (
                <li>{word}</li>
              )
            })}</ul>

          </div>
        )
      })}
      
    </div>
  );
}
 
export default History;