import React from 'react';
import { useDispatch } from 'react-redux';

import { addPlayers } from '../../redux/players/playersActions';
import { newLetterBag } from '../../redux/letters/lettersActions';

import { letterBag as startBag } from '../../letterBag.js';

import Form from './Form';
import HowTo from './HowTo';

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

      <section className="StartNewGame--Landing">
        <Form onSubmit={startNewGame} />
        <HowTo />
      </section>
    </div>
  );
};

export default StartNewGame;
