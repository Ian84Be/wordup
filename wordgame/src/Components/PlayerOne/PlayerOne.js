
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
        <div className="controls">
          <h4>myScore: {props.myScore}</h4>
          <button onClick={() => props.submitWord()}>Submit</button>
        </div>
      </section>
    );
}

// from https://codehandbook.org/generate-random-string-characters-in-javascript/
export function drawLetters(num) {
  let random_string = '', random_ascii;
  let ascii_low = 65, ascii_high = 90;
  for(let i = 0; i < num; i++) {
      random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
      random_string += String.fromCharCode(random_ascii)
  }
  // TODO
  // add function to guarantee ONE VOWEL && ONE CONSONANT
  // add function to combine Q+u
  return random_string.split('');
}
 
export default PlayerOne;
