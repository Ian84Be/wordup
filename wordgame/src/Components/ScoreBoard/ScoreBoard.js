import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">

      {props.players.map(player => {
        return (
          <div className={player.id === props.activePlayer ? 'active playerCard' : 'playerCard'}>

            <div className="name">{player.myName}</div>
            <div className="score">{(player.myScore === 0) ? '0' : player.myScore}</div>
          
            <ul className="history">{player.myHistory.map(word => {
              return (
                <li>{word}</li>
              )
            })}</ul>

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