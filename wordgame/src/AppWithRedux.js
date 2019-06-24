
import React from 'react';
import {connect} from 'react-redux';
import {
    addHistory,
    addPassCount,
    addScore,
    changeMyLetters, 
    holdLetter,
    loadDictionary, 
    makeBoard,
    newErrMsg,
    newGameHistory,
    newLetterBag,
    newMessage,
    nextPlayer
} from './redux/actions';

import MiniScores from './Components/MiniScores/MiniScores';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import History from './Components/History/History.js';
import PlayerControls from './Components/PlayerControls/PlayerControls.js';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard.js';
import StartNewGame from './Components/StartNewGame/StartNewGame.js';

import './App.scss';

// TODO fix blank rendering on old iPad chrome (47.0.2526.107) && safari
// is this related to my dynamic import in componentDidMount()?

class App extends React.Component {
  render() { 
    if (this.props.players.length<1) return (
      <StartNewGame 
        message={this.props.message} 
        players={this.props.players} 
      />
    );
    const {activePlayer,clickedLetter,errMsg,gameBoard,gameHistory,letterBag,message,players} = this.props;
    const {myHistory,myLetters,myName,myScore} = players[activePlayer];
    let firstRound = true;
    players.forEach(player => {
      if (player.myScore>0) firstRound = false;
    });
    return ( 
      <div className="container">

        <div className="middleContainer">
        <ScoreBoard
              activePlayer={activePlayer}
              letterBag={letterBag}
              myHistory={myHistory}
              myName={myName}
              myScore={myScore}
              passTurn={this.passTurn}
              players={players}
          />

          <div className="middleContainer--center">
            <MiniScores 
              activePlayer={activePlayer}
              players={players}
            />
            <GameBoard 
                boardClick={this.boardClick}
                clickedLetter={clickedLetter}
                firstRound={firstRound}
                gameBoard={gameBoard}
                onDragStart={this.onDragStart}
                onDrop={this.onDrop}
            />

            <PlayerControls 
            clickedLetter={clickedLetter}
            clearBoard={this.clearBoard}
            letterClick={this.letterClick}
            myLetters={myLetters}
            onDragStart={this.onDragStart}
            passTurn={this.passTurn}
            submitLetters={this.submitLetters}
            />
          </div>

          <History
            activePlayer={activePlayer}
            errMsg={errMsg}
            gameHistory={gameHistory}
            letterBag={letterBag}
            message={message} 
            myHistory={myHistory}
            myName={myName}
            myScore={myScore}
            passTurn={this.passTurn}
            players={players}
          />

        </div>
      </div>
    );
  } // render() END
    componentDidMount() {
    // TODO
    // create config object
    // DEFAULT config object >> 'wordUp rules' = setRules(build oneWay, waitTurn, 8board)
    // toggle config obj >> 'fast rules' = setRules(build bothWays, loseTurn, 6board)
    // toggle config obj >> combine Qu
    const myGrid = boardMaker(8);
    this.props.makeBoard(myGrid);
    import("./scrabbleWordList.js").then(dictionary => {
      this.props.loadDictionary(dictionary.default)
    });
  } // componentDidMount() END

  boardClick = (e, index, isActive) => {
    //TODO
    // build >> this.changeTiles(incomingTile, target)
    // add function to click gameBoard first then click incomingLetter
    e.preventDefault();
    const {activePlayer, clickedLetter, gameBoard, players} = this.props;
    const {myLetters} = players[activePlayer];
    const myNewLetters = [...myLetters];
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    let activeIndex = clickedLetter[2];
    let newClicked = [];
    if (clickedLetter.length===0 && !isActive) return;
    if (clickedLetter.length===0 && isActive) newClicked = [thisTile.stack[0], null, index];
    if (clickedLetter.length>0 && !isActive) {
      if (clickedLetter[0] === thisTile.stack[0]) return this.props.newErrMsg(`this letter is already ${thisTile.stack[0]}`);
      thisTile.stack.unshift(clickedLetter[0]);
      thisTile.active = true;
      if (activeIndex || activeIndex === 0) {
        newBoard[activeIndex].stack.shift();
        newBoard[activeIndex].active = false;
      } else myNewLetters.splice(clickedLetter[1],1);
    }
    if (clickedLetter.length>2 && isActive) {
      if (newBoard[activeIndex].stack[0] === thisTile.stack[1]) return this.props.newErrMsg(`this letter is already ${thisTile.stack[1]}`);
      if (newBoard[activeIndex].stack[1] === thisTile.stack[0]) return this.props.newErrMsg(`this letter is already ${thisTile.stack[0]}`);
      if (activeIndex === index) {
        thisTile.stack.shift();
        thisTile.active = false;
        myNewLetters.push(clickedLetter[0]);
        return this.updateStore([],myNewLetters, newBoard,'');
      }
      newBoard[activeIndex].stack.shift();
      newBoard[activeIndex].stack.unshift(thisTile.stack[0]);
      thisTile.stack.shift();
      thisTile.stack.unshift(clickedLetter[0]);
    }
    if (clickedLetter.length===2 && isActive) {
      if (clickedLetter[0] === thisTile.stack[1]) return this.props.newErrMsg(`this letter is already ${thisTile.stack[1]}`);
      myNewLetters.splice(clickedLetter[1],1,thisTile.stack[0]);
      thisTile.stack.shift();
      thisTile.stack.unshift(clickedLetter[0]);
    }
    return this.updateStore(newClicked,myNewLetters, newBoard,'');
  }

  clearBoard = () => {
    const {activePlayer, gameBoard, players} = this.props;
    const {myLetters} = players[activePlayer];
    const activeTiles = gameBoard.filter(tile => tile.active);
    if (activeTiles.length<1) return;
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
      return this.updateStore([],myNewLetters, newBoard,'');
    }
  }

  calculateScore = (foundWords) => {
    // TODO
    // Players may not pluralize a word simply by adding an S at its end.
    // only allowed if the S is part of another complete word that is played onto the board in the same turn. 
   
    let words=[],thisWord='',score=0;
      foundWords.forEach(tileSet => {
        let tempScore = 0;
        let tempWord = [];
          tileSet[1].forEach(tile => {
            tempWord.push(tile.stack[0]);
            return tempScore = tempScore + tile.stack.length;
          });
        thisWord = tempWord.join('').toLowerCase();
        if (this.dictionaryCheck(thisWord)) {
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
          return [score,words];
        }
      });
    return [score,words];
  } // this.calculateScore() END >> back to scoreWords();

  dictionaryCheck = (word) => {
    if (!this.props.dictionary) return this.props.newMessage(`dictionary loading... please wait...`);
    return (this.props.dictionary.includes(word)) ? true : false;
    // return true;
  } // this.dictionaryCheck() END >> back to this.calculateScore();

  endGame = () => {
    const {players} = this.props;
    let playersFinal = [...players];
    // RULES >> Players lose five points for every unused tile they hold at the end of the game.
    playersFinal.forEach(player => player.myScore -= player.myLetters.length);
    playersFinal.sort((a,b) => b.myScore - a.myScore);
    let finalMessage = playersFinal.map(player => `${player.myName}: ${player.myScore}`);
    finalMessage[0] += ' WINNER!';
    this.props.newMessage(finalMessage.join(' // '));
  }
  
  findWords = (activeTiles) => {
    const tempWords = [];
    activeTiles.forEach(tile => tempWords.push(...this.lookBothWays(tile)));
    let foundWords = this.uniqWords(tempWords);
    if (foundWords.length>0) return this.scoreWords(foundWords);
  } // this.findWords() END >> return this.scoreWords(foundWords);

  getLetters = (num) => {
    let newBag = {...this.props.letterBag};
    let myLetters=[], random_letter;
    for (let i = 0; i < num; i++) {
      let grabBag = Object.entries(newBag).filter(letter => letter[1] > 0);
      if (grabBag.length<1) {
        console.log('grabBag.length<1')
        this.props.newLetterBag(newBag);
        this.props.newErrMsg('letterBag is EMPTY');
        return myLetters;
      }
      let random = Math.floor(Math.random() * grabBag.length);
      random_letter = grabBag[random][0];
      myLetters.push(random_letter);
      grabBag[random][1]--;
      newBag[random_letter] = grabBag[random][1];
    }
    this.props.newLetterBag(newBag);
    return myLetters;
  }

  passLetters = (num) => {
    const {activePlayer,addPassCount,emptyBag,letterBag,newMessage,passCount,players} = this.props;
    const {myLetters} = players[activePlayer];
    // RULES >> END GAME if letterBag is empty and every player passes in a single round
    if (emptyBag) addPassCount(passCount+1);
    if (emptyBag && players.length-1 === passCount) return this.props.newErrMsg('END GAME // PASSCOUNT MAX');
    let newBag = {...letterBag};
    let myOldLetters = [...myLetters];
    let myNewLetters=[], random_letter;
    for (let i = 0; i < num; i++) {
      let grabBag = Object.entries(newBag).filter(letter => letter[1] > 0);
      if (grabBag.length<1) {
        this.props.newLetterBag(newBag);
        this.props.newErrMsg('letterBag is EMPTY');
        return myNewLetters;
      }
      let random = Math.floor(Math.random() * grabBag.length);
      random_letter = grabBag[random][0];
      myNewLetters.push(random_letter);
      grabBag[random][1]--;
      newBag[random_letter] = grabBag[random][1];
    }
    myOldLetters.forEach(letter => newBag[letter]++);
    this.props.newLetterBag(newBag);
    return myNewLetters;
  }

  letterClick = (e, letter, myLettersIndex) => {
    e.preventDefault();
    const {activePlayer, clickedLetter, gameBoard, players} = this.props;
    const {myLetters} = players[activePlayer];
    if (clickedLetter.length>0) {
      let activeIndex = clickedLetter[2];
      if (activeIndex || activeIndex === 0) {
        const newBoard = [...gameBoard];
        const thisTile = newBoard[activeIndex];
        if (thisTile.stack[1] === letter) return this.props.newErrMsg(`this letter is already ${letter}`);
        if (thisTile.stack[0] === letter) return this.props.newErrMsg(`this letter is already ${letter}`);
        thisTile.stack.shift();
        let myNewLetters = [...myLetters];
        myNewLetters.splice(myLettersIndex,1,clickedLetter[0]);
        thisTile.stack.unshift(letter);
        return this.updateStore([],myNewLetters, newBoard,'');
      }
      if (clickedLetter[1] === myLettersIndex) {
        this.props.holdLetter([]);
        return this.props.newErrMsg('');
      }
    }
    this.props.holdLetter([letter, myLettersIndex]);
    return this.props.newErrMsg('');
  } // this.letterClick() END

  lookBothWays = (startTile) => {
    const newBoard = [...this.props.gameBoard];
    const result = []
    const {id} = startTile;
    let tempAct=[],tempWord=[];
    let vertAct=[],vertWord=[];
    let horAct=[],horWord=[];
      // find VERTICAL word
      let above = (id < 20) ? null : startLook('above', startTile);
      if (above) {
        vertWord.push(...above[0]);
        vertAct.push(...above[1]);
      }
      let below = (id > 79) ? null : startLook('below', startTile);
      if (below) {
        vertWord.push(...below[0]);
        vertAct.push(...below[1]);
      }
      // find HORIZONTAL word
      let left = (id % 10 === 0) ? null : startLook('left', startTile);
      if (left) {
        horWord.push(...left[0]);
        horAct.push(...left[1]);
      }
      let right = (id-7 % 10 === 0) ? null : startLook('right', startTile);
      if (right) {
        horWord.push(...right[0]);
        horAct.push(...right[1]);
      }
    vertAct = [startTile,...vertAct].sort((a,b) => a.id-b.id).map(tile => tile.id);
    vertWord = [startTile,...vertWord].sort((a,b) => a.id-b.id);
    horAct = [startTile,...horAct].sort((a,b) => a.id-b.id).map(tile => tile.id);
    horWord = [startTile,...horWord].sort((a,b) => a.id-b.id);
    if (vertWord.length>1) result.push(['vert',vertWord,vertAct]);
    if (horWord.length>1) result.push(['hor',horWord,horAct]);
    return result;

    function startLook(direction, startTile) {
      let next,offset;
      if (direction === 'above') offset = -10;
      if (direction === 'below') offset = 10;
      if (direction === 'left') offset = -1;
      if (direction === 'right') offset = 1;
      next = newBoard.find(tile => tile.id === startTile.id+offset);
      if (next && next.stack.length>0) {
        tempWord.push(next);
        if (next.active) tempAct.push(next);
        return startLook(direction, next);
      } else if (tempWord.length>0) {
        const thisWord = tempWord.sort((a,b) => a.id-b.id);
        const thisAct = tempAct.sort((a,b) => a.id-b.id);
        const result = [thisWord,thisAct]
        tempWord=[];
        tempAct=[];
        return result;
      } else return null;
    } // startLook() END
  } // lookBothWays() END >> back to this.findWords()

  nextPlayer = (addScore) => {
    const {activePlayer,emptyBag,players} = this.props;
    const {myLetters,myName} = players[activePlayer];
    const oldLetters = [...myLetters];
    let newLetters=[],randomLetters=[];
    // PASS >> Pass turn to nextPlayer and draw 7 new letters
    if (addScore === 0) {
        newLetters = this.passLetters(7);
        this.props.holdLetter([])
        this.props.changeMyLetters(newLetters);
        // this.props.newMessage('')
        return this.props.nextPlayer();
    }
    else if (emptyBag && myLetters.length===0) {
      // RULES >> END GAME if letterBag is empty and one player has used all of his/her tiles
      this.props.newMessage(`END GAME // ${myName} CLEAR`);
      return this.endGame();
    }
    // add new letters to hand 
    else if (!emptyBag && myLetters.length<7) {
      randomLetters = this.getLetters(7-myLetters.length);
      newLetters = [...oldLetters,...randomLetters];
      this.props.holdLetter([]);
      this.props.changeMyLetters(newLetters);
      // this.props.newMessage('');
      this.props.addScore(addScore);
      return this.props.nextPlayer();
    }
    else if (emptyBag && myLetters.length<7) {
      this.props.holdLetter([]);
      // this.props.newMessage('');
      // RULES >> END GAME if letterBag is empty and every player passes in a single round
      this.props.addPassCount(0);
      this.props.addScore(addScore);
      return this.props.nextPlayer();
    }
  }

  onDragStart = (e, index, isActive = false) => {
    if (typeof(index) !== 'number') return e.dataTransfer.setData("letter", index);
    else if (!isActive) return;
    else {
      const thisTile = this.props.gameBoard[index];
      e.dataTransfer.setData("incomingIndex", index || '0');
      e.dataTransfer.setData("letter", thisTile.stack[0]);
    }
  }

  onDrop = (e, droppedOnIndex, onActive) => {
    const incomingIndex = e.dataTransfer.getData("incomingIndex");
    const incomingLetter = e.dataTransfer.getData("letter");
    if (incomingLetter === '') return;
    const {activePlayer, gameBoard, players} = this.props;
    const {myLetters} = players[activePlayer];
    const newBoard = [...gameBoard];
    const myNewLetters = [...myLetters];
    const droppedOnTile = newBoard[droppedOnIndex];
    const droppedOnLetter = droppedOnTile.stack[0];
    if (droppedOnLetter === incomingLetter) return this.props.newErrMsg(`this letter is already ${incomingLetter}`);
    if (onActive && droppedOnTile.stack[1] === incomingLetter) return this.props.newErrMsg(`this letter is already ${incomingLetter}`);
    if (incomingIndex !== '') {
      if (onActive && droppedOnTile.stack[0] === newBoard[incomingIndex].stack[1]) return this.props.newErrMsg(`this letter is already ${droppedOnTile.stack[0]}`);
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      if (onActive) {
        droppedOnTile.stack.shift();
        incomingTile.stack.unshift(droppedOnLetter);
      } else incomingTile.active = false;
      droppedOnTile.stack.unshift(incomingLetter);
    } else {
      myNewLetters.splice(myNewLetters.indexOf(incomingLetter),1);
      if (onActive) {
        droppedOnTile.stack.shift();
        myNewLetters.push(droppedOnLetter);
      }
      droppedOnTile.stack.unshift(incomingLetter);
    }
    droppedOnTile.active = true;
    this.updateStore([],myNewLetters, newBoard,'');
  } // this.onDrop() END

  passTurn = () => {
    const activeTiles = this.props.gameBoard.filter(tile => tile.active);
    if (activeTiles.length>0) return this.props.newErrMsg('cannot pass with active tiles on board');
    else return this.nextPlayer(0);
  } // this.passTurn() END >> this.nextPlayer(0);

  submitLetters = () => {
    const activeTiles = this.props.gameBoard.filter(tile => tile.active).sort((a,b) => a.id-b.id);
    if (activeTiles.length<1) return this.props.newErrMsg('you haven\'t placed any tiles');
    else return this.findWords(activeTiles);
  } // this.submitLetters END >> this.findWords(activeTiles);

  // this.scoreWords() START >> strictModeScoring(foundWords) >> this.calculateScore(foundWords)
  scoreWords = (foundWords) => {
    // TODO 
    // RULES >> The first player must cover one or more of the four central squares
    // RULES >> Subsequent players may put tiles on the board adjacent to and/or on top of the tiles already played
    // RULES >> No stack may be more than five tiles high
    // RULES >> At least one tile or stack must be left unchanged; a player may not cover every letter in a word on a single turn.

    const {activePlayer,players} = this.props;
    const {myLetters,myName} = players[activePlayer];
    const newBoard = [...this.props.gameBoard];
    // RULES >> strictModeScoring >> all tiles played on a turn must form part of one continuous line of tiles vertical or horizontal
    let okStrict = strictModeScoring(foundWords);
    // TODO
    // refactor this error message to include FIRST ROUND rules
    if (okStrict === 'central') return this.props.newErrMsg('First Player must cover at least ONE of the central squares!');
    if (!okStrict) return this.props.newErrMsg('Error: Cannot build in both directions!');
    const activeTiles = newBoard.filter(tile => tile.active);
    let scoreInfo = this.calculateScore(foundWords);
    let score = scoreInfo[0];
    const words = scoreInfo[1];
    if (typeof score === 'number') {
      if (activeTiles.length===7 && myLetters.length===0) {
        // RULES >> 20 bonus points for using all seven tiles in one turn
        score += 20;
        words.unshift('20 (RACK BONUS)');
      }
      activeTiles.forEach((tile) => {
        let thisIndex = newBoard.findIndex(that => that.id === tile.id);
        newBoard[thisIndex].active = false;
      });
      this.props.makeBoard(newBoard);
      this.props.newMessage(`${myName} scored ${score} !`);
      this.props.addHistory(words);
      words.forEach(word => this.props.newGameHistory(`${myName} ${word}`));
      // this.props.newGameHistory(`${myName} ${words}`);
      return this.nextPlayer(score);
    } else {
      let failWords = words.filter(word => word.match(/[a-z]/g));
      return this.props.newErrMsg(`dictionary FAIL ( ${failWords} )`);
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
        (direction === 'vert') ? vertActive.push(...activeTiles) : horActive.push(...activeTiles);
      });
      const activeTiles = newBoard.filter(tile => tile.active);
      let vertDupe = activeTiles.every(tile => vertActive.includes(tile.id));
      let horDupe = activeTiles.every(tile => horActive.includes(tile.id));
      let dupeCheck = (vertDupe && horDupe) ? true : false;
      if (vertDupe && horActive.length<2) dupeCheck = true;
      if (horDupe && vertActive.length<2) dupeCheck = true;
      let uniqActive = new Set();
      for (let ids of vertActive) uniqActive.add(ids);
      for (let ids of horActive) uniqActive.add(ids);
      // RULES >> All tiles played on a turn must form part of one continuous line of tiles vertical or horizontal
      if (uniqActive.size < activeTiles.length) return false;
      // RULES >> The first player must cover one or more of the four central squares 8x8(43, 44, 53, 54);
      let firstRound = true;
      players.forEach(player => {
        if (player.myScore>0) firstRound = false;
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
      if (vertActive.length > 0) okVert = lineLook('vert',vertActive);
      else okVert=0;
      if (horActive.length > 0) okHor = lineLook('hor',horActive);
      else okHor=0;
      if (okVert && okHor === 0) return (dupeCheck) ? true : false;
      if (okHor && okVert === 0) return true;
      if (okVert && vertDupe) return true;
      if (okHor && horDupe) return true;
      if (okVert === 0 && okHor === 0) return (dupeCheck) ? true : false;
      else return false;

      function lineLook(direction, line) {
        let okVert,okHor,result=false;
        let startTile = line[0];
        // console.log('startTile',startTile);
        if (direction === 'hor') {
          // let thisRow = `${startTile}`.charAt(0);
          // console.log('thisRow',thisRow);
          let leftLimit = startTile - (startTile % 10);
          let rightLimit = leftLimit + 7;
          // console.log('leftLimit',leftLimit,'/',startTile,'/',rightLimit,' rightLimit');
          okHor = line.every(id => (id >= leftLimit && id <= rightLimit));
          if (okHor) result = true;
        }
        if (direction === 'vert') {
          // let thisCol = `${startTile}`.charAt(1);
          // console.log('thisCol',thisCol);
          okVert = line.every(id => (id % 10 === startTile % 10));
          // console.log('lineLook() okVert',okVert);
          if (okVert) result = true;
        }
        return result;
      } // lineLook() END >> back to strictModeScoring()
    } // strictModeScoring() END 
  } // this.scoreWords() END >> return this.nextPlayer(score);

  uniqWords = (tempWords) => {
    const seen = {};
    const result = tempWords.filter(tile => {
      let word = JSON.stringify(tile);
      return seen.hasOwnProperty(word) ? false : (seen[word] = true);
    });
    return result;
  }

  updateStore = (holdLetter = [], myNewLetters, newBoard, newMessage = '') => {
    this.props.holdLetter(holdLetter);
    this.props.changeMyLetters(myNewLetters);
    this.props.makeBoard(newBoard);
    this.props.newMessage(newMessage);
    this.props.newErrMsg('');
  }
} // App COMPONENT END

const mapStateToProps = state => ({
    activePlayer: state.activePlayer,
    clickedLetter: state.clickedLetter,
    dictionary: state.dictionary,
    emptyBag: state.emptyBag,
    errMsg: state.errMsg,
    gameBoard: state.gameBoard,
    gameHistory: state.gameHistory,
    letterBag: {...state.letterBag},
    message: state.message,
    passCount: state.passCount,
    players: state.players
});
export default connect(mapStateToProps, { 
    addHistory,
    addPassCount,
    addScore,
    changeMyLetters, 
    holdLetter, 
    loadDictionary, 
    makeBoard, 
    newErrMsg,
    newGameHistory,
    newLetterBag,
    newMessage,
    nextPlayer
})(App)