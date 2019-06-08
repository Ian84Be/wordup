
import React from 'react';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard.js'
import scrabbleWordList from './scrabbleWordList.js';
import './App.scss';

export default class App extends React.Component {
  state = { 
    activeTiles:[],
    gameBoard:[],
    message: '',
    myHistory:[],
    myLetters:[],
    myScore:0,
  };
  render() { 
    const {activeTiles, myLetters,myScore, gameBoard} = this.state;
    return ( 
      <div className="container">
        <PlayerOne 
          myLetters={myLetters}
          myScore={myScore}
          onDragStart={this.onDragStart}
          submitLetters={() => this.submitLetters(activeTiles)}
        />

        <GameBoard 
          activeTiles={this.state.activeTiles}
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
    // default to 'fast mode' && 'standard board'
    const myGrid = boardMaker(8);
    // const myNewLetters = drawLetters(8);
    const myNewLetters = ['T','Qu','E','B','S','I','N','K'];
    this.setState(prevState => ({
      ...prevState,
      gameBoard: myGrid,
      myLetters: myNewLetters
    }))
  }

  boardClick = (e, index) => {
    e.preventDefault();
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    if (!activeTiles.includes(thisTile)) return;
    const thisLetter = thisTile.stack.shift();
    if (!thisLetter) return;
    const myNewLetters = [...myLetters, thisLetter];
    const newActive = [...activeTiles];
    newActive.splice(newActive.findIndex(tile => tile.id === thisTile.id),1);

    this.setState(prevState => ({
      ...prevState,
      activeTiles: newActive,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  nextPlayer = (addScore) => {
    let newLetters = drawLetters(8-this.state.myLetters.length);
    this.setState(prevState => ({
      ...prevState,
      activeTiles:[],
      message: '',
      myLetters: [...prevState.myLetters,...newLetters],
      myScore: prevState.myScore + addScore
    }))
  }

  onDragStart = (e, index) => {
    if (typeof(index) !== 'number') return e.dataTransfer.setData("letter", index);
    const {activeTiles, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    if (!activeTiles.includes(thisTile)) return e.dataTransfer.setData("letter", "blank");
    if (e.target.classList.contains('active')) {
      e.dataTransfer.setData("incomingIndex", index);
      e.dataTransfer.setData("letter", thisTile.stack[0]);
    } 
  }

  onDrop = (e, droppedOnIndex) => {
    const letter = e.dataTransfer.getData("letter");
    if (letter === 'blank' || letter === 'undefined' ) return console.log('error: cannot move inactive tile');
    
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const droppedOnTile = newBoard[droppedOnIndex];
    let myNewLetters = [...myLetters];
    let newActiveTiles = [...activeTiles];
    if (activeTiles.includes(droppedOnTile)) return console.log('error: cannot replace active tile');
    if (droppedOnTile.stack[0] === letter) return console.log('error: cannot duplicate letter');

    const incomingIndex = e.dataTransfer.getData("incomingIndex");
    if (incomingIndex) {
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      droppedOnTile.stack.unshift(letter);
      newActiveTiles.splice(newActiveTiles.findIndex(tile => tile.id === incomingTile.id),1);
      newActiveTiles = [...newActiveTiles, droppedOnTile];
    }
    
    if (!incomingIndex) {
      myNewLetters.splice(myNewLetters.indexOf(letter),1)
      droppedOnTile.stack.unshift(letter);
      newActiveTiles = [...activeTiles, droppedOnTile];
    } 

    this.setState(prevState => ({
      ...prevState,
      activeTiles: newActiveTiles,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  passTurn = async () => {
    if (this.state.activeTiles.length>0) return this.setState(() => ({message: 'cannot pass with tiles in play'}));
    let newLetters = drawLetters(8);
    await this.setState(prevState => ({
      ...prevState,
      message: '',
      myLetters: [...newLetters],
    }))
  }

  submitLetters = (activeTiles) => {
    const sorted = [...activeTiles].sort((a,b) => a.id-b.id);
    if (sorted.length<1) return this.setState(() => ({message: 'you havent placed any tiles!'}));
    else this.findWords(sorted);
  }

  scoreWords = (foundWords) => {
    // console.log('scoreWords = (foundWords)',foundWords);
    // console.log('this.state.activeTiles',this.state.activeTiles);
    // TODO
    // strict scoring mode >> force players to build in ONE DIRECTION ONLY
    // double strict scoring >> lose turn if dictionary FAIL
    const {activeTiles} = this.state;
    const activeIds = [];
    activeTiles.forEach(tile => activeIds.push(tile.id));

    let words=[],thisWord='',score=0;
    foundWords.forEach(tileSet => {
      if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
      let tempScore = 0;
      let tempWord = [];
        tileSet.forEach(tile => {
          // console.log('tile',tile);
          let activeIndex = activeIds.indexOf(tile.id);
          // console.log(activeIndex);
          if (activeIndex >= 0) activeIds.splice(activeIndex,1);
          tempWord.push(tile.stack[0]);
          return tempScore = tempScore + tile.stack.length;
        })
      thisWord = tempWord.join('').toLowerCase();
      if (this.dictionaryCheck(thisWord)) {
        score = score + tempScore;
        words.push(` + ( ${tempScore} ${tempWord.join('')} )`);
        tempScore = 0;
      } else {
        return score = 'fail';
      }
    });

    if (activeIds.length>0) return console.log('error: loose tiles');
    if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
    // console.log('score',score,words);
    this.setState(prevState => ({
      ...prevState,
      message: `you scored ${score} !`,
      myHistory: [...prevState.myHistory, words]
    }));
    return this.nextPlayer(score);
  }

  dictionaryCheck = (word) => {
    return (scrabbleWordList.includes(word)) ? true : false;
  }

  findWords = (sortedTiles) => {
    const newBoard = [...this.state.gameBoard];
    const tempWords = [];
    sortedTiles.forEach(tile => tempWords.push(...lookBothWays(tile)));
    let foundWords = uniqWords(tempWords);
    // console.log(foundWords.length,'uniqWords',foundWords);

    if (foundWords.length>0) return this.scoreWords(foundWords);

    function uniqWords(tileIds) {
      const seen = {};
      const result = tileIds.filter(tile => {
        let word = JSON.stringify(tile);
        return seen.hasOwnProperty(word) ? false : (seen[word] = true);
      });
      return result;
    }

    function lookBothWays(startTile) {
      const result = [];
      const {id} = startTile;
      let tempWord = [];
      // find VERTICAL word
      let vertWord = [];
      let above = (id < 20) ? null : startLook('above', startTile);
      if (above) vertWord.push(...above);
      let below = (id > 79) ? null : startLook('below', startTile);
      if (below) vertWord.push(...below);
      vertWord = [startTile,...vertWord].sort((a,b) => a.id-b.id);
      // find HORIZONTAL word
      let horWord = [];
      let left = (id % 10 === 0) ? null : startLook('left', startTile);
      if (left) horWord.push(...left);
      let right = (id-7 % 10 === 0) ? null : startLook('right', startTile);
      if (right) horWord.push(...right);
      horWord = [startTile,...horWord].sort((a,b) => a.id-b.id);
      if (vertWord.length>1) result.push(vertWord);
      if (horWord.length>1) result.push(horWord);
      return result;

      function startLook(direction,startTile) {
        let next,offset;
        if (direction === 'above') offset = -10;
        if (direction === 'below') offset = 10;
        if (direction === 'left') offset = -1;
        if (direction === 'right') offset = 1;
        next = newBoard.find(tile => tile.id === startTile.id+offset);
        if (next && next.stack.length>0) {
          tempWord.push(next);
          return startLook(direction, next);
        } else if (tempWord.length>0) {
          const result = tempWord.sort((a,b) => a.id-b.id);
          tempWord=[];
          return result;
        } else return null;
      } // startLook() END
    } // lookBothWays() END
  } // findWords() END
} // App COMPONENT END
