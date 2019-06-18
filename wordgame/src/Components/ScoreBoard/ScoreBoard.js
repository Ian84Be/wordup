import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
    <div className="playerName">{props.myName}: {(props.myScore === 0) ? '0' : props.myScore}</div>
        <div className="history">{props.myHistory.map(word => {
            return (<div className="word" key={Math.random() * 12345}>{word}</div>);
        })}</div>
    </div>
  );
}
 
export default ScoreBoard;