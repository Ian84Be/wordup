
import React from 'react';
import './PlayerOne.scss';

const PlayerOne = props => {
  if (!props.myLetters) return (<div className="loading">Loading...</div>);
  return ( 
    <section className="PlayerOne">
      <h1>WordUp</h1>
      <div className="myLetters">
        {props.myLetters.map((letter, myLettersIndex) => {
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
        <button onClick={() => props.submitLetters()}>Submit</button>
        <button onClick={() => props.passTurn()}>Pass</button>
          <div className="message">{props.message}</div>
        <button onClick={() => props.clearBoard()}>Clear Board</button>
      </div>
    </section>
  );
}

// from https://codehandbook.org/generate-random-string-characters-in-javascript/
export function drawLetters(num) {
  let random_string = [], random_ascii;
  let ascii_low = 65, ascii_high = 90;
  for(let i = 0; i < num; i++) {
    random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
    // TODO
    // toggle config obj >> combine Qu
    if (random_ascii === 81) random_string.push('Qu');
    else random_string.push(String.fromCharCode(random_ascii));
  }
  return random_string;
}
 
export default PlayerOne;
