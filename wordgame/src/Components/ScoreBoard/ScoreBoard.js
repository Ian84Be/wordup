import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
        <h1>WordUp</h1>
        <div className="myScore">myScore: {props.myScore}</div>
        <button onClick={() => props.passTurn()}>Pass</button>
        <div className="message">{props.message}</div>
        <div className="myHistory">{props.myHistory.map(word => {
            return (<div className="word" key={Math.random() * 12345}>{word}</div>);
        })}</div>
    </div>
  );
}
 
export default ScoreBoard;