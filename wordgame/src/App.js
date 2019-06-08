
import React from 'react';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
import scrabbleWordList from './scrabbleWordList';
import './App.scss';

export default class App extends React.Component {
  state = { 
    activeTiles:[],
    gameBoard:[],
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
          onDragStart={(e, letter) => e.dataTransfer.setData("letter", letter)}
          passTurn={this.passTurn}
          submitLetters={() => this.submitLetters(activeTiles)}
        />

        <GameBoard 
          activeTiles={this.state.activeTiles}
          boardClick={this.boardClick}
          gameBoard={gameBoard}
          onDrop={this.onDrop}
        />
    </div> 
    );
  } // render() END
    componentDidMount() {
    const myGrid = boardMaker(8);
    const myNewLetters = drawLetters(8);
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
      myLetters: myNewLetters
    }));
  }

  nextPlayer = (addScore) => {
    let newLetters = drawLetters(8-this.state.myLetters.length);
    this.setState(prevState => ({
      ...prevState,
      activeTiles:[],
      myLetters: [...prevState.myLetters,...newLetters],
      myScore: prevState.myScore + addScore
    }))
  }

  onDrop = (e, index) => {
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    if (activeTiles.includes(thisTile)) return;

    const letter = e.dataTransfer.getData("letter");
    const myNewLetters = [...myLetters];
    myNewLetters.splice(myNewLetters.indexOf(letter),1)
    thisTile.stack.unshift(letter);

    this.setState(prevState => ({
      ...prevState,
      activeTiles: [...prevState.activeTiles, thisTile],
      gameBoard: newBoard,
      myLetters: myNewLetters
    }));
  }

  passTurn = async () => {
    console.log('pass')
    if (this.state.activeTiles.length>0) return console.log('error: cannot pass with active tiles');
    let newLetters = drawLetters(8);
    await this.setState(prevState => ({
      ...prevState,
      myLetters: [...newLetters],
    }))
  }

  submitLetters = (activeTiles) => {
    const sorted = [...activeTiles].sort((a,b) => a.id-b.id);
    if (sorted.length<1) return console.log('error: no active tiles');
    else this.findWords(sorted);
  }

  scoreWords = (foundWords) => {
    let words=[],thisWord='',score=0;
    foundWords.forEach(tileSet => {
      let tempScore = 0;
      let tempWord = [];
      tileSet.forEach(tile => {
        tempWord.push(tile.stack[0]);
        tempScore = tempScore + tile.stack.length;
      })
      thisWord = tempWord.join('').toLowerCase();
      if (this.dictionaryCheck(thisWord)) {
        score = score + tempScore;
        words.push(`${tempWord.join('')} ${tempScore}`);
        tempScore = 0;
      } else {
        return score = 'fail';
      }
    });
    if (score === 'fail') return console.log('dict FAIL',thisWord);
    console.log('score',score,words);
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
