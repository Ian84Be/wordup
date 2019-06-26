
import React from 'react';

const PlayerControls = props => {
  return ( 
    <section className="PlayerControls">
      <div className="countDown">{Object.values(props.letterBag).reduce((a,b)=>a+b)} letters remaining</div>

      <div className="myLetters">
        {props.myLetters.length>0 && props.myLetters.map((letter, myLettersIndex) => {
          let clicked = (props.clickedLetter[1] === myLettersIndex) ? ' clicked' : '';
            return (
              <div 
                className={"tile letter"+clicked}
                draggable
                key={(Math.random() * 100)}
                onDragStart={e => props.onDragStart(e, letter)}
                onClick={e => props.letterClick(e, letter, myLettersIndex)}
              >
                {letter}
              </div>
            )
          })}
      </div>

      <div className="controls">
        <button onClick={() => props.passTurn()}>Pass</button>
        {props.myLetters.length===7 ? (
          <button onClick={() => props.shuffleLetters(props.myLetters)}>Shuffle</button>
        ) : (
          <button onClick={() => props.submitLetters()}>Submit</button>
        )}
          <div className="message">{props.message}</div>
        <button onClick={() => props.clearBoard()}>Clear Board</button>
      </div>
    </section>
  );
}
 
export default PlayerControls;
