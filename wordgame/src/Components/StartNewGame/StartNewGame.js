import React from 'react';
import { useDispatch } from 'react-redux';

import { addPlayers } from '../../redux/players/playersActions';
import { newLetterBag } from '../../redux/letters/lettersActions';

import { letterBag as startBag } from '../../letterBag.js';

import Form from './Form';

const StartNewGame = () => {
  const dispatch = useDispatch();

  const startNewGame = (e, num, newPlayers) => {
    e.preventDefault();
    let players = num.map((num, i) => ({
      id: i,
      myHistory: [],
      myLetters: startLetters(7),
      myName: newPlayers[`name ${num}`],
      myScore: 0
    }));
    dispatch(newLetterBag(startBag));
    return dispatch(addPlayers(players));
  };

  function startLetters(num) {
    let myLetters = [],
      random_letter;
    for (let i = 0; i < num; i++) {
      let grabBag = Object.entries(startBag).filter(letter => letter[1] > 0);
      let random = Math.floor(Math.random() * grabBag.length);
      random_letter = grabBag[random][0];
      myLetters.push(random_letter);
      --grabBag[random][1];
      startBag[random_letter] = grabBag[random][1];
    }
    return myLetters;
  }

  return (
    <div className="StartNewGame">
      <h1 className="logo__big">WordUp</h1>
      <div className="headline">A 3-Dimensional Word Game</div>

      <Form onSubmit={startNewGame} />
      <h2>HOW - TO - PLAY</h2>
      <div className="rules">
        <ul>
          <li>
            <p>Place tiles on the board to build words!</p>
          </li>
          <li>
            <p>
              The first player must cover <em>one or more</em> of the four{' '}
              <em>central squares</em>.
            </p>
          </li>
          <li>
            <p>
              All tiles played on a turn must form part of one continuous line
              of tiles <em>vertical </em> or <em>horizontal</em>.
            </p>
          </li>

          <h3>Scoring</h3>
          <li>
            <p>
              Words built with stacked letters score <br />
              <em>1 point</em> per tile in the stack.
            </p>
          </li>
          <li>
            <p>
              Words built with <em>no stacked letters</em> score{' '}
              <em>2 points</em> per tile.
            </p>
          </li>
          <li>
            <p>
              2 <em>bonus points</em> for using "Qu" in a word with{' '}
              <em>no stacked letters</em>.
            </p>
          </li>
          <li>
            <p>
              20 <em>bonus points</em> for using all seven tiles in one turn.
            </p>
          </li>

          <h3>End Game</h3>
          <li>
            <p>
              The <em>game ends </em> when letterBag is empty and one player has
              used all of their tiles, or when letterBag is empty and every
              player passes in a single round.
            </p>
          </li>
          <li>
            <p>
              Players lose <em>5 points</em> for each unused tile they hold at
              the end of the game.
            </p>
          </li>

          <h3>Player Controls</h3>
          <li>
            <p>PASS >> Pass your turn and draw seven new letters</p>
          </li>
          <li>
            <p>SHUFFLE >> Shuffle the display of your letters</p>
          </li>
          <li>
            <p>SUBMIT >> Submit played words for scoring</p>
          </li>
          <li>
            <p>CLEAR BOARD >> Clear all activeTiles from the GameBoard</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StartNewGame;
