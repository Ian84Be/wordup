
import React from 'react';

const PlayerOne = props => {
  if (!props.myLetters) return (<div className="loading">Loading...</div>);
  return ( 
    <section className="PlayerOne">

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
        <button onClick={() => props.passTurn()}>Pass</button>
        <button onClick={() => props.submitLetters()}>Submit</button>
          <div className="message">{props.message}</div>
        <button onClick={() => props.clearBoard()}>Clear Board</button>
      </div>
    </section>
  );
}

// TODO
// limit pool
// classic 65 tiles
// International Standard 100 tiles
const letterBag = {
  A: 5,
  B: 2,
  C: 2,
  D: 3,
  E: 6,
  G: 2,
  H: 2,
  I: 4,
  J: 1,
  K: 1,
  L: 3,
  M: 3,
  N: 3,
  O: 4,
  P: 3,
  Qu: 1,
  R: 2,
  S: 3,
  T: 4,
  U: 3,
  V: 1,
  W: 1,
  X: 1,
  Y: 2,
  Z: 1
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
