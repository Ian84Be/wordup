
import React from 'react';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard.js'

import './App.scss';

// dictionary DISABLED for testing
// import scrabbleWordList from './scrabbleWordList.js';

export default class App extends React.Component {
  state = { 
    gameBoard:[],
    message: '',
    myHistory:[],
    myLetters:[],
    myScore:0,
  };
  render() { 
    const {myLetters,myScore, gameBoard} = this.state;
    return ( 
      <div className="container">
        <PlayerOne 
          myLetters={myLetters}
          myScore={myScore}
          onDragStart={this.onDragStart}
          submitLetters={this.submitLetters}
        />

        <GameBoard 
          boardClick={this.boardClick}
          gameBoard={gameBoard}
          onDragStart={this.onDragStart}
          onDrop={this.onDrop}
        />

        <ScoreBoard
          message={this.state.message}
          myHistory={this.state.myHistory}
          myScore={this.state.myScore}
          passTurn={this.passTurn}
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
    // const myNewLetters = drawLetters(8);
    const myNewLetters = ['T','Qu','E','B','S','I','N','K'];
    this.setState(prevState => ({
      ...prevState,
      gameBoard: myGrid,
      myLetters: myNewLetters
    }))
  }

  boardClick = (e, index, isActive) => {
    e.preventDefault();
    if (!isActive) return;
    const newBoard = [...this.state.gameBoard];
    const thisTile = newBoard[index];
    const thisLetter = thisTile.stack.shift();
    // if (!thisLetter) return console.log('NO LETTERZ');
    thisTile.active = false;
    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      message: '',
      myLetters: [...this.state.myLetters, thisLetter]
    }));
  }

  nextPlayer = (addScore) => {
    const oldLetters = [...this.state.myLetters];
    let newLetters=[],randomLetters=[];
    if (addScore === 0) newLetters = drawLetters(8);
    if (this.state.myLetters.length<8) {
      randomLetters = drawLetters(8-this.state.myLetters.length);
      newLetters = [...oldLetters,...randomLetters];
    }
    // TODO
    // powerup E9 tile if theirScore - myScore > 40
    // toggle config obj >> guarantee ONE VOWEL
    // fix so that hand INCLUDES one vowel >> put this on App method for nextPlayer
    const vowels = ['A','E','I','O','U'];
    let hasVowel = 0;
    vowels.forEach(vowel => {
      if (newLetters.includes(vowel)) ++hasVowel;
    });
    if (!hasVowel) {
      let randomV = vowels[Math.floor(Math.random()*5)];
      console.log('randomV',randomV);
      newLetters.pop();
      newLetters.push(randomV);
    }
    this.setState(prevState => ({
      ...prevState,
      activeTiles:[],
      message: '',
      myLetters: newLetters,
      myScore: prevState.myScore + addScore
    }))
  }

  onDragStart = (e, index, isActive = false) => {
    // console.log('dragSTART index',index);
    if (typeof(index) !== 'number') return e.dataTransfer.setData("letter", index);
    else if (!isActive) return;
    else {
      const thisTile = this.state.gameBoard[index];
      e.dataTransfer.setData("incomingIndex", index);
      e.dataTransfer.setData("letter", thisTile.stack[0]);
    }
  }

  onDrop = (e, droppedOnIndex, isActive) => {
    if (isActive) return this.setState(() => ({message: `cannot replace active tile!`}));
    const letter = e.dataTransfer.getData("letter");
    if (letter === '') return;
    const newBoard = [...this.state.gameBoard];
    const myNewLetters = [...this.state.myLetters];
    const droppedOnTile = newBoard[droppedOnIndex];
    if (droppedOnTile.stack[0] === letter) return this.setState(() => ({message: `this letter is already ${letter}!`}));
    const incomingIndex = e.dataTransfer.getData("incomingIndex");
    if (incomingIndex) {
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      droppedOnTile.stack.unshift(letter);
      incomingTile.active = false;
    } else {
      myNewLetters.splice(myNewLetters.indexOf(letter),1)
      droppedOnTile.stack.unshift(letter);
    }
    droppedOnTile.active = true;
    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  passTurn = () => {
    const activeTiles = this.state.gameBoard.filter(tile => tile.active);
    if (activeTiles.length>0) return this.setState(() => ({message: 'cannot pass with active tiles on board!'}));
    this.nextPlayer(0);
  } // this.passTurn() END >> this.nextPlayer(0);

  submitLetters = () => {
    const activeTiles = this.state.gameBoard.filter(tile => tile.active).sort((a,b) => a.id-b.id);
    if (activeTiles.length<1) return this.setState(() => ({message: 'you havent placed any tiles!'}));
    else this.findWords(activeTiles);
  } // this.submitLetters END >> this.findWords(activeTiles);

  // this.scoreWords() START >> strictModeScoring(foundWords) >> this.calculateScore(foundWords)
  scoreWords = (foundWords) => {
    // TODO
    // double strict scoring >> lose turn if dictionary FAIL
    const newBoard = [...this.state.gameBoard];
    let okStrict = strictModeScoring(foundWords);
    if (!okStrict) return console.log('error: strictModeScoring VIOLATION');
    const activeTiles = newBoard.filter(tile => tile.active);

    let scoreInfo = this.calculateScore(foundWords);
    // console.log('scoreWords scoreInfo',scoreInfo);
    const score = scoreInfo[0];
    const words = scoreInfo[1];
    console.log('score',score,words);
    
    if (score !== 'fail') {
      // console.log('scoreWords PASS activeTiles',activeTiles);
      activeTiles.forEach((tile) => {
        let thisIndex = newBoard.findIndex(that => that.id === tile.id);
        newBoard[thisIndex].active = false;
      });
      this.setState(prevState => ({
        ...prevState,
        gameBoard: newBoard,
        message: `you scored ${score} !`,
        myHistory: [...prevState.myHistory, words]
      }));
      return this.nextPlayer(score);
    } else {
      console.log('scoreWords FAIL');
      return this.setState(() => ({message: `dictionary FAIL ${words}`}));
    }

    // strict scoring mode >> force players to build in ONE DIRECTION ONLY
    function strictModeScoring(foundWords) {
      console.log('strictModeScoring(foundWords)',foundWords);

      let vertActive = [];
      let horActive = [];
      foundWords.forEach(tileSet => {
        let direction = tileSet[0];
        let activeTiles = tileSet[2];
        (direction === 'vert') ? vertActive.push(...activeTiles) : horActive.push(...activeTiles);
      });
      console.log('vertActive',vertActive,'horActive',horActive);
      const activeTiles = newBoard.filter(tile => tile.active);
      console.log('activeTiles',activeTiles);
      // if (activeIds.length>0) return console.log('error: loose tiles');

      if (vertActive.length === 1 && horActive.length === 1) {
        if (vertActive[0] !== horActive[0]) return console.log('strictMode FAIL >> cannot build in two directions!');
      }

      let oneColumn = true;
      if (vertActive.length>0) oneColumn = vertActive.every(id => id % 10 === vertActive[0] % 10);

      let oneRow = true;
      let leftLimit = horActive[0] - (horActive[0] % 10);
      let rightLimit = leftLimit + 7;
      horActive.forEach((id, i) => {
        if (id < leftLimit || id > rightLimit) oneRow = false;
      });
      console.log('oneRow',oneRow);
      console.log('oneColumn',oneColumn);

      if (!oneColumn || !oneRow) return console.log('strictMode FAIL >> cannot build in two directions!');
      if (oneColumn && oneRow) return console.log('strictMode FAIL >> cannot build in two directions!');
      // let oneRow = horActive.every(id => {})
      return true;

      // if (vertActive.length === 1 && horActive.length === 1) {
      //   if (vertActive[0] !== horActive[0]) return console.log('strictMode FAIL >> cannot build in two directions!');
      // } else if (vertActive.length>1 && horActive.length>1) {
      //   let isEqual = true;
      //   vertActive.forEach(tile => {
      //     if (!horActive.includes(tile)) isEqual = false;
      //   });
      //   if (!isEqual) return console.log('strictMode FAIL >> cannot build in two directions!');
      // }
      
    } // strictModeScoring() END 
  } // this.scoreWords() END >> return this.nextPlayer(score);
  
  calculateScore = (foundWords) => {
    // check the tileSet of each foundWord, push the letter to tempWord, score the letter based on stack length
    let words=[],thisWord='',score=0;
      foundWords.forEach(tileSet => {
        let tempScore = 0;
        let tempWord = [];
        // console.log('calculateScore tileSet[0]',tileSet[0]);
        // console.log('calculateScore tileSet[1]',tileSet[1]);
          tileSet[1].forEach(tile => {
            // console.log('scoring tile',tile);
            // console.log('tile.active',tile.active);
            // if (tile.active) tile.active = false;
            tempWord.push(tile.stack[0]);
            return tempScore = tempScore + tile.stack.length;
          });
        thisWord = tempWord.join('').toLowerCase();
        if (this.dictionaryCheck(thisWord)) {
          score = score + tempScore;
          words.push(` + ( ${tempScore} ${tempWord.join('')} )`);
          tempScore = 0;
        } else {
          console.log('calculateScore dictionary FAIL',thisWord);
          score = 'fail';
          words.push(thisWord);
          return [score,words];
        }
      });
    return [score,words];
  } // this.calculateScore() END >> back to scoreWords();

  dictionaryCheck = (word) => {
    // return false;
    return true;
    // return (scrabbleWordList.includes(word)) ? true : false;
  } // this.dictionaryCheck() END >> back to this.calculateScore();

  // this.findWords() START 
  // >> this.lookBothWays(startTile) x startLook(direction, startTile) 
  // >> this.uniqWords(tempWords) 
  // END >> this.scoreWords(foundWords);
  findWords = (activeTiles) => {
    const tempWords = [];
    activeTiles.forEach(tile => tempWords.push(...this.lookBothWays(tile)));
    // console.log('!!! ### !!! findWords tempWords',tempWords);
    let foundWords = this.uniqWords(tempWords);
    console.log(foundWords.length,'uniqWords',foundWords);
    if (foundWords.length>0) return this.scoreWords(foundWords);
  } // this.findWords() END >> return this.scoreWords(foundWords);

  lookBothWays = (startTile) => {
    const newBoard = [...this.state.gameBoard];
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
    // console.log('vertWord',vertWord,'vertAct',vertAct);
    // console.log('horWord',horWord,'horAct',horAct);
    // console.log('result',result);
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

  uniqWords = (tempWords) => {
    const seen = {};
    const result = tempWords.filter(tile => {
      let word = JSON.stringify(tile);
      return seen.hasOwnProperty(word) ? false : (seen[word] = true);
    });
    return result;
  }
} // App COMPONENT END
