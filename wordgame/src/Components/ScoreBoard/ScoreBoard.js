import React from 'react';

const ScoreBoard = (props) => {
  return (
    <div className="ScoreBoard">
        <div className="myHistory">{props.myHistory.map(word => {
            return (<div className="word" key={Math.random() * 12345}>{word}</div>);
        })}</div>
        <div className="myScore">{(props.myScore === 0) ? 'myScore' : props.myScore}</div>
    </div>
  );
}
 
export default ScoreBoard;