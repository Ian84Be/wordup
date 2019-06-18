
import React from 'react';
import {connect} from 'react-redux';
import {
    addHistory,
    addScore,
    changeMyLetters, 
    holdLetter,
    loadDictionary, 
    makeBoard,
    newMessage,
    nextPlayer
} from './redux/actions';

import AddPlayer from './Components/AddPlayer/AddPlayer';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard.js';

import './App.scss';

// TODO fix blank rendering on old iPad chrome (47.0.2526.107) && safari
// is this related to my dynamic import in componentDidMount()?
class App extends React.Component {
  render() { 
    const {activePlayer,clickedLetter,gameBoard,message,players} = this.props;
    const {myHistory,myLetters,myName,myScore} = players[activePlayer];
    return ( 
      <div className="container">
        <PlayerOne 
          clickedLetter={clickedLetter}
          clearBoard={this.clearBoard}
          letterClick={this.letterClick}
          myLetters={myLetters}
          onDragStart={this.onDragStart}
          passTurn={this.passTurn}
          submitLetters={this.submitLetters}
        />

          <GameBoard 
            boardClick={this.boardClick}
            clickedLetter={clickedLetter}
            gameBoard={gameBoard}
            message={message}
            onDragStart={this.onDragStart}
            onDrop={this.onDrop}
          />

          <ScoreBoard
              myHistory={myHistory}
              myName={myName}
              myScore={myScore}
          />

          <AddPlayer
            activePlayer={activePlayer}
            players={players}
          />
      </div> 
    );
  } // render() END
    componentDidMount() {
    // TODO
    // create config object
    // DEFAULT config object >> 'wordUp rules' = setRules(build oneWay, waitTurn, 8board)
    // toggle config obj >> 'fast rules' = setRules(build bothWays, loseTurn, 6board)
    // toggle config obj >> guarantee ONE VOWEL
    // toggle config obj >> combine Qu
    const myGrid = boardMaker(8);
    this.props.makeBoard(myGrid);
    // const myNewLetters = drawLetters(8);
    const myNewLetters = ['T','Qu','E','B','S','I','N','K'];
    this.props.changeMyLetters(myNewLetters);
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
      if (clickedLetter[0] === thisTile.stack[0]) return this.props.newMessage(`this letter is already ${thisTile.stack[0]}`);
      thisTile.stack.unshift(clickedLetter[0]);
      thisTile.active = true;
      if (activeIndex || activeIndex === 0) {
        newBoard[activeIndex].stack.shift();
        newBoard[activeIndex].active = false;
      } else myNewLetters.splice(clickedLetter[1],1);
    }
    if (clickedLetter.length>2 && isActive) {
      if (newBoard[activeIndex].stack[0] === thisTile.stack[1]) return this.props.newMessage(`this letter is already ${thisTile.stack[1]}`);
      if (newBoard[activeIndex].stack[1] === thisTile.stack[0]) return this.props.newMessage(`this letter is already ${thisTile.stack[0]}`);
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
      if (clickedLetter[0] === thisTile.stack[1]) return this.props.newMessage(`this letter is already ${thisTile.stack[1]}`);
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
    // check the tileSet of each foundWord, push the letter to tempWord, score the letter based on stack length
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
          score = score + tempScore;
          words.push(` + ( ${tempScore} ${tempWord.join('')} )`);
          tempScore = 0;
        } else {
          // console.log('calculateScore dictionary FAIL',thisWord);
          score = 'fail';
          words.push(thisWord);
          return [score,words];
        }
      });
    return [score,words];
  } // this.calculateScore() END >> back to scoreWords();

  dictionaryCheck = (word) => {
    if (!this.props.dictionary) return this.props.newMessage(`dictionary loading... please wait...`);
    // return true;
    return (this.props.dictionary.includes(word)) ? true : false;
  } // this.dictionaryCheck() END >> back to this.calculateScore();

  findWords = (activeTiles) => {
    const tempWords = [];
    activeTiles.forEach(tile => tempWords.push(...this.lookBothWays(tile)));
    let foundWords = this.uniqWords(tempWords);
    // console.log(foundWords.length,'uniqWords',foundWords);
    if (foundWords.length>0) return this.scoreWords(foundWords);
  } // this.findWords() END >> return this.scoreWords(foundWords);

  letterClick = (e, letter, myLettersIndex) => {
    e.preventDefault();
    const {activePlayer, clickedLetter, gameBoard, players} = this.props;
    const {myLetters} = players[activePlayer];
    if (clickedLetter.length>0) {
      let activeIndex = clickedLetter[2];
      if (activeIndex || activeIndex === 0) {
        const newBoard = [...gameBoard];
        const thisTile = newBoard[activeIndex];
        if (thisTile.stack[1] === letter) return this.props.newMessage(`this letter is already ${letter}`);
        if (thisTile.stack[0] === letter) return this.props.newMessage(`this letter is already ${letter}`);
        thisTile.stack.shift();
        let myNewLetters = [...myLetters];
        myNewLetters.splice(myLettersIndex,1,clickedLetter[0]);
        thisTile.stack.unshift(letter);
        return this.updateStore([],myNewLetters, newBoard,'');
      }
      if (clickedLetter[1] === myLettersIndex) {
        this.props.holdLetter([]);
        return this.props.newMessage('');
      }
    }
    this.props.holdLetter([letter, myLettersIndex]);
    return this.props.newMessage('');
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
    const {activePlayer, players} = this.props;
    const {myLetters} = players[activePlayer];
    const oldLetters = [...myLetters];
    let newLetters=[],randomLetters=[];
    // pass turn to next player and draw all new letters
    if (addScore === 0) {
        newLetters = drawLetters(8);
        this.props.holdLetter([])
        this.props.changeMyLetters(newLetters);
        this.props.newMessage('')
        return this.props.nextPlayer();
    }

    if (myLetters.length<8) {
      randomLetters = drawLetters(8-myLetters.length);
      newLetters = [...oldLetters,...randomLetters];
    }
    // TODO
    // powerup S9 tile if theirScore - myScore > 40
    // toggle config obj >> guarantee ONE VOWEL
    // fix so that hand INCLUDES one vowel >> put this on App method for nextPlayer
    const vowels = ['A','E','I','O','U'];
    let hasVowel = 0;
    vowels.forEach(vowel => {
      if (newLetters.includes(vowel)) ++hasVowel;
    });
    if (!hasVowel) {
      let randomV = vowels[Math.floor(Math.random()*5)];
      newLetters.pop();
      newLetters.push(randomV);
    }
    this.props.holdLetter([]);
    // this.props.newMessage('');
    this.props.changeMyLetters(newLetters);
    this.props.addScore(addScore);
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
    if (droppedOnLetter === incomingLetter) return this.props.newMessage(`this letter is already ${incomingLetter}`);
    if (onActive && droppedOnTile.stack[1] === incomingLetter) return this.props.newMessage(`this letter is already ${incomingLetter}`);
    if (incomingIndex !== '') {
      if (onActive && droppedOnTile.stack[0] === newBoard[incomingIndex].stack[1]) return this.props.newMessage(`this letter is already ${droppedOnTile.stack[0]}`);
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
    if (activeTiles.length>0) return this.props.newMessage('cannot pass with active tiles on board');
    else return this.nextPlayer(0);
  } // this.passTurn() END >> this.nextPlayer(0);

  submitLetters = () => {
    const activeTiles = this.props.gameBoard.filter(tile => tile.active).sort((a,b) => a.id-b.id);
    if (activeTiles.length<1) return this.props.newMessage('you haven\'t placed any tiles');
    else return this.findWords(activeTiles);
  } // this.submitLetters END >> this.findWords(activeTiles);

  // this.scoreWords() START >> strictModeScoring(foundWords) >> this.calculateScore(foundWords)
  scoreWords = (foundWords) => {
    const newBoard = [...this.props.gameBoard];
    let okStrict = strictModeScoring(foundWords);
    if (!okStrict) return this.props.newMessage('error: cannot build in both directions');
    const activeTiles = newBoard.filter(tile => tile.active);
    let scoreInfo = this.calculateScore(foundWords);
    const score = scoreInfo[0];
    const words = scoreInfo[1];
    if (typeof(score) === 'number') {
      activeTiles.forEach((tile) => {
        let thisIndex = newBoard.findIndex(that => that.id === tile.id);
        newBoard[thisIndex].active = false;
      });
      this.props.makeBoard(newBoard);
      this.props.newMessage(`you scored ${score} !`);
      this.props.addHistory(words);
      return this.nextPlayer(score);
    } else {
      let failWords = words.filter(word => word.match(/[a-z]/g));
      return this.props.newMessage(`dictionary FAIL ( ${failWords} )`);
    } 
    // TODO
    // MAKE SURE > after 1st turn > active tiles are touching played tiles
    // double strict scoring >> lose turn if dictionary FAIL

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
        // console.log('vertActive',vertActive,'horActive',horActive);
      const activeTiles = newBoard.filter(tile => tile.active);
      let vertDupe = activeTiles.every(tile => vertActive.includes(tile.id));
      let horDupe = activeTiles.every(tile => horActive.includes(tile.id));
      let dupeCheck = (vertDupe && horDupe) ? true : false;
        // console.log('vertDupe',vertDupe,'horDupe',horDupe,'dupeCheck',dupeCheck);
      if (vertDupe && horActive.length<2) dupeCheck = true;
      if (horDupe && vertActive.length<2) dupeCheck = true;
        // console.log('dupeCheck',dupeCheck);
      let uniqActive = new Set();
      for (let ids of vertActive) uniqActive.add(ids);
      for (let ids of horActive) uniqActive.add(ids);
        // console.log('activeTiles',activeTiles);
        // console.log('uniqActive',uniqActive);
      if (uniqActive.size < activeTiles.length) return this.newMessage('error: loose tiles');
      let okHor, okVert;
      if (vertActive.length > 0) okVert = lineLook('vert',vertActive);
      else okVert=0;
      // console.log('okVert',okVert);
      if (horActive.length > 0) okHor = lineLook('hor',horActive);
      else okHor=0;
        // console.log('okHor',okHor);
        // console.log('okVert',okVert,'okHor',okHor);
        // console.log('dupeCheck',dupeCheck);
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
  }
} // App COMPONENT END

const mapStateToProps = state => ({
    activePlayer: state.activePlayer,
    clickedLetter: state.clickedLetter,
    dictionary: state.dictionary,
    gameBoard: state.gameBoard,
    message: state.message,
    players: state.players
});
export default connect(mapStateToProps, { 
    addHistory,
    addScore,
    changeMyLetters, 
    holdLetter, 
    loadDictionary, 
    makeBoard, 
    newMessage,
    nextPlayer
})(App)