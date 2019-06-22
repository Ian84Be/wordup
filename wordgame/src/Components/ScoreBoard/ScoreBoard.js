import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
<h1>WordUp</h1>
      {props.players.map(player => {
        return (
          <div key={player.id} className={player.id === props.activePlayer ? 'active playerCard' : 'playerCard'}>

            <div className="name">{player.myName}: {(player.myScore === 0) ? '0' : player.myScore}</div>
            {/* <div className="score">{(player.myScore === 0) ? '0' : player.myScore}</div> */}
          
            {/* <ul className="history">{player.myHistory.map(word => {
              return (
                <li>{word}</li>
              )
            })}</ul> */}

            {/* <div className="history">{player.myHistory.map(word => {
                return (<div className="word" key={Math.random() * 12345}>{word}</div>);
            })}</div> */}

            {/* <div>{player.myLetters}</div> */}

          </div>
        )
      })}

    </div>
  );
}
 
export default ScoreBoard;