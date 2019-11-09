import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addHistory,
  addPassCount,
  addScore,
  changeMyLetters,
  changePlayer
} from '../../redux/players/playersActions';
import { makeBoard } from '../../redux/config/configActions';
import {
  newErrMsg,
  newGameHistory,
  newMessage
} from '../../redux/commo/commoActions';
import { holdLetter, newLetterBag } from '../../redux/letters/lettersActions';

const PlayerControls = () => {
  const dispatch = useDispatch();
  const gameBoard = useSelector(s => s.config.gameBoard);
  const dictionary = useSelector(s => s.config.dictionary);
  const activePlayer = useSelector(s => s.players.activePlayer);
  const players = useSelector(s => s.players.players);
  const passCount = useSelector(s => s.players.passCount);
  const holdingLetter = useSelector(s => s.letters.holdingLetter);
  const letterBag = useSelector(s => s.letters.letterBag);
  const emptyBag = useSelector(s => s.letters.emptyBag);
  let myLetters = players[activePlayer].myLetters;

  return (
    <section className="PlayerControls">
      <div className="countDown">
        {Object.values(letterBag).reduce((a, b) => a + b)} letters remaining
      </div>

      <div className="myLetters">
        {myLetters.length > 0 &&
          myLetters.map((letter, myLettersIndex) => {
            let clicked = holdingLetter[1] === myLettersIndex ? ' clicked' : '';
            return (
              <div
                className={'tile letter' + clicked}
                draggable
                key={Math.random() * 100}
                onDragStart={e => onDragStart(e, letter)}
                onClick={e => letterClick(e, letter, myLettersIndex)}
              >
                {letter}
              </div>
            );
          })}
      </div>

      <div className="controls">
        <button onClick={() => passTurn()}>Pass</button>
        {myLetters.length === 7 ? (
          <button onClick={() => shuffleLetters(myLetters)}>Shuffle</button>
        ) : (
          <button onClick={() => submitLetters()}>Submit</button>
        )}
        <button onClick={() => clearBoard()}>Clear Board</button>
      </div>
    </section>
  );

  function onDragStart(e, index) {
    return e.dataTransfer.setData('letter', index);
  }

  function calculateScore(foundWords) {
    // TODO
    // Players may not pluralize a word simply by adding an S at its end.
    // only allowed if the S is part of another complete word that is played onto the board in the same turn.
    let words = [],
      thisWord = '',
      score = 0;
    foundWords.forEach(tileSet => {
      let tempScore = 0;
      let tempWord = [];
      tileSet[1].forEach(tile => {
        tempWord.push(tile.stack[0]);
        return (tempScore = tempScore + tile.stack.length);
      });
      thisWord = tempWord.join('').toLowerCase();
      if (dictionaryCheck(thisWord)) {
        // RULES >> Any word with no stacked letters scores two points per tile
        if (tempWord.length === tempScore) {
          tempScore *= 2;
          // words.push('(FLAT BONUS)');
          // RULES >> 2 bonus points are awarded for using the "Qu" tile in a one-level word
          if (tempWord.includes('Qu')) {
            tempScore += 2;
            // words.push('(FLAT Qu BONUS)');
          }
        }
        score = score + tempScore;
        words.push(`${tempScore} ${tempWord.join('')}`);
        tempScore = 0;
      } else {
        score = 'fail';
        words.push(thisWord);
        return [score, words];
      }
    });
    return [score, words];
  } // this.calculateScore() END >> back to scoreWords();

  function dictionaryCheck(word) {
    if (!dictionary)
      return dispatch(newMessage(`dictionary loading... please wait...`));
    return dictionary.includes(word) ? true : false;
  } // this.dictionaryCheck() END >> back to this.calculateScore();

  // this.scoreWords() START >> strictModeScoring(foundWords) >> this.calculateScore(foundWords)
  function scoreWords(foundWords) {
    // TODO
    // RULES >> The first player must cover one or more of the four central squares
    // RULES >> Subsequent players may put tiles on the board adjacent to and/or on top of the tiles already played
    // RULES >> No stack may be more than five tiles high
    // RULES >> At least one tile or stack must be left unchanged; a player may not cover every letter in a word on a single turn.
    const { myLetters, myName } = players[activePlayer];
    const newBoard = [...gameBoard];
    // RULES >> strictModeScoring >> all tiles played on a turn must form part of one continuous line of tiles vertical or horizontal
    let okStrict = strictModeScoring(foundWords);
    // TODO
    // refactor this error message to include FIRST ROUND rules
    if (okStrict === 'central')
      return dispatch(
        newErrMsg(
          'First Player must cover at least ONE of the central squares!'
        )
      );
    if (!okStrict)
      return dispatch(newErrMsg('Error: Cannot build in both directions!'));
    const activeTiles = newBoard.filter(tile => tile.active);
    let scoreInfo = calculateScore(foundWords);
    let score = scoreInfo[0];
    const words = scoreInfo[1];
    if (typeof score === 'number') {
      if (activeTiles.length === 7 && myLetters.length === 0) {
        // RULES >> 20 bonus points for using all seven tiles in one turn
        score += 20;
        words.unshift('20 (RACK BONUS)');
      }
      activeTiles.forEach(tile => {
        let thisIndex = newBoard.findIndex(that => that.id === tile.id);
        newBoard[thisIndex].active = false;
      });
      dispatch(makeBoard(newBoard));
      dispatch(newMessage(`${myName} scored ${score} !`));
      dispatch(addHistory(words));
      words.forEach(word => dispatch(newGameHistory(`${myName} ${word}`)));
      return nextPlayer(score);
    } else {
      let failWords = words.filter(word => word.match(/[a-z]/g));
      return dispatch(newErrMsg(`dictionary FAIL ( ${failWords} )`));
    }
    // TODO
    // RULES >> after 1st turn > active tiles are touching played tiles
    // toggle config obj >> double strict scoring >> lose turn if dictionary FAIL

    // strictModeScoring() START
    // >> lineLook()
    function strictModeScoring(foundWords) {
      let vertActive = [];
      let horActive = [];
      foundWords.forEach(tileSet => {
        let direction = tileSet[0];
        let activeTiles = tileSet[2];
        direction === 'vert'
          ? vertActive.push(...activeTiles)
          : horActive.push(...activeTiles);
      });
      const activeTiles = newBoard.filter(tile => tile.active);
      let vertDupe = activeTiles.every(tile => vertActive.includes(tile.id));
      let horDupe = activeTiles.every(tile => horActive.includes(tile.id));
      let dupeCheck = vertDupe && horDupe ? true : false;
      if (vertDupe && horActive.length < 2) dupeCheck = true;
      if (horDupe && vertActive.length < 2) dupeCheck = true;
      let uniqActive = new Set();
      for (let ids of vertActive) uniqActive.add(ids);
      for (let ids of horActive) uniqActive.add(ids);
      // RULES >> All tiles played on a turn must form part of one continuous line of tiles vertical or horizontal
      if (uniqActive.size < activeTiles.length) return false;
      // RULES >> The first player must cover one or more of the four central squares 8x8(43, 44, 53, 54);
      let firstRound = true;
      players.forEach(player => {
        if (player.myScore > 0) firstRound = false;
      });
      if (firstRound) {
        let playedCentral = false;
        let centralSquares = [43, 44, 53, 54];
        centralSquares.forEach(id => {
          if (uniqActive.has(id)) playedCentral = true;
        });
        if (!playedCentral) return 'central'; // RULES >> The first player must cover one or more of the four central squares
      }
      let okHor, okVert;
      if (vertActive.length > 0) okVert = lineLook('vert', vertActive);
      else okVert = 0;
      if (horActive.length > 0) okHor = lineLook('hor', horActive);
      else okHor = 0;
      if (okVert && okHor === 0) return dupeCheck ? true : false;
      if (okHor && okVert === 0) return true;
      if (okVert && vertDupe) return true;
      if (okHor && horDupe) return true;
      if (okVert === 0 && okHor === 0) return dupeCheck ? true : false;
      else return false;

      function lineLook(direction, line) {
        let okVert,
          okHor,
          result = false;
        let startTile = line[0];
        if (direction === 'hor') {
          let leftLimit = startTile - (startTile % 10);
          let rightLimit = leftLimit + 7;
          okHor = line.every(id => id >= leftLimit && id <= rightLimit);
          if (okHor) result = true;
        }
        if (direction === 'vert') {
          okVert = line.every(id => id % 10 === startTile % 10);
          if (okVert) result = true;
        }
        return result;
      } // lineLook() END >> back to strictModeScoring()
    } // strictModeScoring() END
  } // this.scoreWords() END >> return this.nextPlayer(score);

  function shuffleLetters(letters) {
    // Fisher–Yates-Knuth shuffle
    let shuffled = [...letters];
    for (let i = letters.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return dispatch(changeMyLetters(shuffled));
  }

  function submitLetters() {
    const activeTiles = gameBoard
      .filter(tile => tile.active)
      .sort((a, b) => a.id - b.id);
    if (activeTiles.length < 1)
      return dispatch(newErrMsg("you haven't placed any tiles"));
    else return findWords(activeTiles);
  } // this.submitLetters END >> this.findWords(activeTiles);

  function findWords(activeTiles) {
    const tempWords = [];
    activeTiles.forEach(tile => tempWords.push(...lookBothWays(tile)));
    let foundWords = uniqWords(tempWords);
    if (foundWords.length > 0) return scoreWords(foundWords);
  } // this.findWords() END >> return this.scoreWords(foundWords);

  function uniqWords(tempWords) {
    const seen = {};
    const result = tempWords.filter(tile => {
      let word = JSON.stringify(tile);
      return seen.hasOwnProperty(word) ? false : (seen[word] = true);
    });
    return result;
  }

  function lookBothWays(startTile) {
    const newBoard = [...gameBoard];
    const result = [];
    const { id } = startTile;
    let tempAct = [],
      tempWord = [];
    let vertAct = [],
      vertWord = [];
    let horAct = [],
      horWord = [];
    // find VERTICAL word
    let above = id < 20 ? null : startLook('above', startTile);
    if (above) {
      vertWord.push(...above[0]);
      vertAct.push(...above[1]);
    }
    let below = id > 79 ? null : startLook('below', startTile);
    if (below) {
      vertWord.push(...below[0]);
      vertAct.push(...below[1]);
    }
    // find HORIZONTAL word
    let left = id % 10 === 0 ? null : startLook('left', startTile);
    if (left) {
      horWord.push(...left[0]);
      horAct.push(...left[1]);
    }
    let right = id - (7 % 10) === 0 ? null : startLook('right', startTile);
    if (right) {
      horWord.push(...right[0]);
      horAct.push(...right[1]);
    }
    vertAct = [startTile, ...vertAct]
      .sort((a, b) => a.id - b.id)
      .map(tile => tile.id);
    vertWord = [startTile, ...vertWord].sort((a, b) => a.id - b.id);
    horAct = [startTile, ...horAct]
      .sort((a, b) => a.id - b.id)
      .map(tile => tile.id);
    horWord = [startTile, ...horWord].sort((a, b) => a.id - b.id);
    if (vertWord.length > 1) result.push(['vert', vertWord, vertAct]);
    if (horWord.length > 1) result.push(['hor', horWord, horAct]);
    return result;

    function startLook(direction, startTile) {
      let next, offset;
      if (direction === 'above') offset = -10;
      if (direction === 'below') offset = 10;
      if (direction === 'left') offset = -1;
      if (direction === 'right') offset = 1;
      next = newBoard.find(tile => tile.id === startTile.id + offset);
      if (next && next.stack.length > 0) {
        tempWord.push(next);
        if (next.active) tempAct.push(next);
        return startLook(direction, next);
      } else if (tempWord.length > 0) {
        const thisWord = tempWord.sort((a, b) => a.id - b.id);
        const thisAct = tempAct.sort((a, b) => a.id - b.id);
        const result = [thisWord, thisAct];
        tempWord = [];
        tempAct = [];
        return result;
      } else return null;
    } // startLook() END
  } // lookBothWays() END >> back to this.findWords()

  function endGame() {
    let playersFinal = [...players];
    // RULES >> Players lose five points for every unused tile they hold at the end of the game.
    playersFinal.forEach(player => (player.myScore -= player.myLetters.length));
    playersFinal.sort((a, b) => b.myScore - a.myScore);
    let finalMessage = playersFinal.map(
      player => `${player.myName}: ${player.myScore}`
    );
    finalMessage[0] += ' WINNER!';
    dispatch(newMessage(finalMessage.join(' // ')));
  }

  function passTurn() {
    const activeTiles = gameBoard.filter(tile => tile.active);
    if (activeTiles.length > 0)
      return dispatch(newErrMsg('cannot pass with active tiles on board'));
    else return nextPlayer(0);
  } // this.passTurn() END >> this.nextPlayer(0);

  function nextPlayer(score) {
    const { myLetters, myName } = players[activePlayer];
    const oldLetters = [...myLetters];
    let newLetters = [];
    let randomLetters = [];
    // PASS >> Pass turn to nextPlayer and draw 7 new letters
    if (score === 0) {
      newLetters = passLetters(7);
      dispatch(holdLetter([]));
      dispatch(changeMyLetters(newLetters));
      return dispatch(changePlayer());
    } else if (emptyBag && myLetters.length === 0) {
      // RULES >> END GAME if letterBag is empty and one player has used all of his/her tiles
      dispatch(newMessage(`END GAME // ${myName} CLEAR`));
      return endGame();
    }
    // add new letters to hand
    else if (!emptyBag && myLetters.length < 7) {
      randomLetters = getLetters(7 - myLetters.length);
      newLetters = [...oldLetters, ...randomLetters];
      dispatch(holdLetter([]));
      dispatch(changeMyLetters(newLetters));
      dispatch(addScore(score));
      return dispatch(changePlayer());
    } else if (emptyBag && myLetters.length < 7) {
      dispatch(holdLetter([]));
      // RULES >> END GAME if letterBag is empty and every player passes in a single round
      dispatch(addPassCount(0));
      dispatch(addScore(score));
      return dispatch(changePlayer());
    }
  }

  function getLetters(num) {
    let newBag = { ...letterBag };
    let myLetters = [],
      random_letter;
    for (let i = 0; i < num; i++) {
      let grabBag = Object.entries(newBag).filter(letter => letter[1] > 0);
      if (grabBag.length < 1) {
        dispatch(newLetterBag(newBag));
        dispatch(newErrMsg('letterBag is EMPTY'));
        return myLetters;
      }
      let random = Math.floor(Math.random() * grabBag.length);
      random_letter = grabBag[random][0];
      myLetters.push(random_letter);
      grabBag[random][1]--;
      newBag[random_letter] = grabBag[random][1];
    }
    dispatch(newLetterBag(newBag));
    return myLetters;
  }

  function passLetters(num) {
    const { myLetters } = players[activePlayer];
    // RULES >> END GAME if letterBag is empty and every player passes in a single round
    if (emptyBag) dispatch(addPassCount(passCount + 1));
    if (emptyBag && players.length - 1 === passCount)
      return dispatch(newErrMsg('END GAME // PASSCOUNT MAX'));
    let newBag = { ...letterBag };
    let myOldLetters = [...myLetters];
    let myNewLetters = [],
      random_letter;
    for (let i = 0; i < num; i++) {
      let grabBag = Object.entries(newBag).filter(letter => letter[1] > 0);
      if (grabBag.length < 1) {
        dispatch(newLetterBag(newBag));
        dispatch(newErrMsg('letterBag is EMPTY'));
        return myNewLetters;
      }
      let random = Math.floor(Math.random() * grabBag.length);
      random_letter = grabBag[random][0];
      myNewLetters.push(random_letter);
      grabBag[random][1]--;
      newBag[random_letter] = grabBag[random][1];
    }
    myOldLetters.forEach(letter => newBag[letter]++);
    dispatch(newLetterBag(newBag));
    return myNewLetters;
  }

  function clearBoard() {
    const { myLetters } = players[activePlayer];
    const activeTiles = gameBoard.filter(tile => tile.active);
    if (activeTiles.length < 1) return;
    else {
      const newBoard = [...gameBoard];
      const myNewLetters = [...myLetters];
      newBoard.forEach(tile => {
        if (tile.active) {
          tile.active = false;
          myNewLetters.push(tile.stack[0]);
          tile.stack.shift();
        }
      });
      return updateStore(myNewLetters, newBoard);
    }
  }

  function letterClick(e, letter, myLettersIndex) {
    e.preventDefault();
    const { myLetters } = players[activePlayer];
    if (holdingLetter.length > 0) {
      let activeIndex = holdingLetter[2];
      if (activeIndex || activeIndex === 0) {
        const newBoard = [...gameBoard];
        const thisTile = newBoard[activeIndex];
        if (thisTile.stack[1] === letter)
          return dispatch(newErrMsg(`this letter is already ${letter}`));
        if (thisTile.stack[0] === letter)
          return dispatch(newErrMsg(`this letter is already ${letter}`));
        thisTile.stack.shift();
        let myNewLetters = [...myLetters];
        myNewLetters.splice(myLettersIndex, 1, holdingLetter[0]);
        thisTile.stack.unshift(letter);
        return updateStore(myNewLetters, newBoard);
      }
      if (holdingLetter[1] === myLettersIndex) {
        dispatch(holdLetter([]));
        return dispatch(newErrMsg(''));
      }
    }
    dispatch(holdLetter([letter, myLettersIndex]));
    return dispatch(newErrMsg(''));
  } // this.letterClick() END

  function updateStore(myNewLetters, newBoard, newHoldLetter = [], msg = '') {
    dispatch(changeMyLetters(myNewLetters));
    dispatch(makeBoard(newBoard));
    dispatch(holdLetter(newHoldLetter));
    dispatch(newMessage(msg));
    dispatch(newErrMsg(''));
  }
};

export default PlayerControls;
