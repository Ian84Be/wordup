
import React from 'react';
import './PlayerOne.scss';

const PlayerOne = props => {
  return ( 
    <section className="PlayerOne">
      <h2>myLetters</h2>
      <div className="myLetters">
        {props.myLetters.map(letter => {
            return (
              <div 
                className="letter"
                draggable
                key={(Math.random() * 100)}
                onDragStart={e => props.onDragStart(e, letter)}
              >
                {letter}
              </div>
            )
          })}
      </div>
      <button onClick={() => props.submitLetters()}>Submit</button>
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
