import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '../../useLocalStorage';

import { changeMyLetters } from '../../redux/players/playersActions';
import { makeBoard } from '../../redux/config/configActions';
import { newErrMsg, newMessage } from '../../redux/commo/commoActions';
import { holdLetter } from '../../redux/letters/lettersActions';

const GameBoard = () => {
  const setl_gameBoard = useLocalStorage('gameBoard', '')[1];
  const [l_players, setl_players] = useLocalStorage('players', '');

  const dispatch = useDispatch();
  const gameBoard = useSelector(s => s.config.gameBoard);
  const activePlayer = useSelector(s => s.players.activePlayer);
  const players = useSelector(s => s.players.players);
  const holdingLetter = useSelector(s => s.letters.holdingLetter);

  const [firstRound, setFirstRound] = useState(true);

  useEffect(() => {
    if (players.length > 0) {
      players.forEach(p => {
        if (p.myScore > 0) setFirstRound(false);
      });
    } else {
      l_players.forEach(p => {
        if (p.myScore > 0) setFirstRound(false);
      });
    }
  }, [firstRound, l_players, players]);

  return (
    <section className={'GameBoard'}>
      {gameBoard.map((tile, index) => {
        let myClassName = 'tile ';
        if (tile.active) myClassName += 'active ';
        if (holdingLetter[2] === index) myClassName += 'clicked ';

        if (tile.stack.length > 0) {
          myClassName += 'stack ';
          myClassName += 'x'.repeat(tile.stack.length);
        } else if (tile.stack.length === 0) myClassName += 'blank';

        if (firstRound) {
          let centralSquares = [43, 44, 53, 54];
          if (centralSquares.includes(tile.id) && tile.stack.length === 0)
            myClassName += ' central';
        }

        return (
          <div
            className={myClassName}
            draggable
            key={tile.id}
            onClick={e => handleClick(e, index, tile.active)}
            onDragStart={e => onDragStart(e, index, tile.active)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, index, tile.active)}
          >
            {tile.stack[0] || ''}
            <small>{tile.stack.length > 1 ? tile.stack.length : ''}</small>
          </div>
        );
      })}
    </section>
  );

  function onDragStart(e, index, isActive = false) {
    if (!isActive) return;
    else {
      const thisTile = gameBoard[index];
      e.dataTransfer.setData('incomingIndex', index || '0');
      e.dataTransfer.setData('letter', thisTile.stack[0]);
    }
  }

  function onDrop(e, droppedOnIndex, onActive) {
    const incomingIndex = e.dataTransfer.getData('incomingIndex');
    const incomingLetter = e.dataTransfer.getData('letter');
    if (incomingLetter === '') return;
    const { myLetters } = players[activePlayer];
    const newBoard = [...gameBoard];
    const myNewLetters = [...myLetters];
    const droppedOnTile = newBoard[droppedOnIndex];
    const droppedOnLetter = droppedOnTile.stack[0];

    if (droppedOnLetter === incomingLetter) {
      return dispatch(newErrMsg(`this letter is already ${incomingLetter}`));
    }

    if (onActive && droppedOnTile.stack[1] === incomingLetter) {
      return dispatch(newErrMsg(`this letter is already ${incomingLetter}`));
    }

    if (incomingIndex !== '') {
      if (
        onActive &&
        droppedOnTile.stack[0] === newBoard[incomingIndex].stack[1]
      )
        return dispatch(
          newErrMsg(`this letter is already ${droppedOnTile.stack[0]}`)
        );
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      if (onActive) {
        droppedOnTile.stack.shift();
        incomingTile.stack.unshift(droppedOnLetter);
      } else incomingTile.active = false;
      droppedOnTile.stack.unshift(incomingLetter);
    } else {
      myNewLetters.splice(myNewLetters.indexOf(incomingLetter), 1);
      if (onActive) {
        droppedOnTile.stack.shift();
        myNewLetters.push(droppedOnLetter);
      }
      droppedOnTile.stack.unshift(incomingLetter);
    }
    droppedOnTile.active = true;
    updateStore(myNewLetters, newBoard);
  } // this.onDrop() END

  function handleClick(e, thisIndex, tileActive) {
    e.preventDefault();
    let newBoard = [...gameBoard];
    let myLetterSet = [...players[activePlayer].myLetters];
    const thisTile = newBoard[thisIndex];
    const thisLetter = thisTile.stack[0];
    const holdingIndex = holdingLetter[2];
    const holdingActive = holdingIndex >= 0 ? true : false;
    let holdingTile;
    if (holdingActive) {
      holdingTile = newBoard[holdingIndex];
    }
    const holding = holdingLetter.length > 0 ? true : false;
    const holdingRaw = holdingLetter.length === 2 ? true : false;
    const holdingLetterFace = holdingLetter[0];
    let newClicked = [];

    /* this is two sequential clicks on the same active gameboard tile
		remove letter from gameboard
		return letter to my held letters 
		clear the clickhold */
    if (holdingIndex === thisIndex) {
      thisTile.stack.shift();
      thisTile.active = false;
      myLetterSet.push(holdingLetterFace);
      return updateStore(myLetterSet, newBoard);
    }

    /* holding letter clicks active gameboard tile
		holding letter is same as clicked letter
		return ERR MSG */
    if (holdingLetterFace === thisLetter)
      return dispatch(newErrMsg(`this letter is already ${thisLetter}`));

    /* empty hand clicks inactive gameboard tile
		do nothing */
    if (!holding && !tileActive) return;

    /* empty hand clicks active gameboard tile
		put tile into hand */
    if (!holding && tileActive) newClicked = [thisLetter, null, thisIndex];

    /* holding letter clicks inactive gameboard tile
		drop the currently held letter 
		onto the inactive gameboard tile 
		change the gameboard tile to ACTIVE
		if holding letter is active, pull it from the gameboard
		else pull it from my currently held letters */
    if (holding && !tileActive) {
      thisTile.stack.unshift(holdingLetterFace);
      thisTile.active = true;
      if (holdingActive) {
        holdingTile.stack.shift();
        holdingTile.active = false;
      } else myLetterSet.splice(holdingLetter[1], 1);
    }

    /* holding letter clicks active gameboard tile
		if/elseif letters are same return new ERR MSG
		else swap held letter with gameboard tile
		*/
    if (holding && tileActive) {
      if (holdingTile.stack[0] === thisTile.stack[1]) {
        return dispatch(
          newErrMsg(`this letter is already ${thisTile.stack[1]}`)
        );
      } else if (holdingTile.stack[1] === thisLetter) {
        return dispatch(newErrMsg(`this letter is already ${thisLetter}`));
      } else {
        holdingTile.stack.shift();
        holdingTile.stack.unshift(thisLetter);
        thisTile.stack.shift();
        thisTile.stack.unshift(holdingLetterFace);
      }
    }

    /* holding letter is from raw letterset, not gameboard
		if letters are same return new ERR MSG
		else drop onto gameboard
		 */
    if (holdingRaw && tileActive) {
      if (holdingLetterFace === thisTile.stack[1]) {
        return dispatch(
          newErrMsg(`this letter is already ${thisTile.stack[1]}`)
        );
      } else {
        myLetterSet.splice(holdingLetter[1], 1, thisLetter);
        thisTile.stack.shift();
        thisTile.stack.unshift(holdingLetterFace);
      }
    }

    // update redux store to finish function
    return updateStore(myLetterSet, newBoard, newClicked);
  } // handleClick() END

  function l_changeLetters(payload) {
    let letterState = [...players];
    letterState[activePlayer].myLetters = payload;
    setl_players(letterState);
  }

  function updateStore(myNewLetters, newBoard, newHoldLetter = [], msg = '') {
    dispatch(changeMyLetters(myNewLetters));
    l_changeLetters(myNewLetters);
    setl_gameBoard(newBoard);
    dispatch(makeBoard(newBoard));
    dispatch(holdLetter(newHoldLetter));
    dispatch(newMessage(msg));
    dispatch(newErrMsg(''));
  }
}; // GameBoard END
export default GameBoard;

// TODO
// custom boards
// 3 square with non-playable center, outer-wall only
// classic 8x8
// International Standard 10x10
// Scrabble (15x15, premium tiles)
export function boardMaker(gridsize) {
  const myGrid = [];
  for (let i = 1; i <= gridsize; i++) {
    for (let j = 0; j < gridsize; j++) {
      myGrid.push({
        active: false,
        id: Number(`${i}${j}`),
        stack: []
      });
    }
  }
  return myGrid;
}
