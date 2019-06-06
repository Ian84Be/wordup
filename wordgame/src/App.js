
import React from 'react';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
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
          onDragStart={this.onDragStart}
          submitWord={() => this.submitWord(activeTiles)}
        />

        <GameBoard 
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

  nextPlayer = (newScore,newBoard) => {
    let newLetters = drawLetters(8-this.state.myLetters.length);
    this.setState(prevState => ({
      ...prevState,
      activeTiles:[],
      gameBoard:newBoard,
      myLetters: [...prevState.myLetters,...newLetters],
      myScore: prevState.myScore + newScore
    }))
  }

	onDragStart = (e, letter) => {
    e.dataTransfer.setData("letter", letter);
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
  } // onDrop() END

  submitWord = (activeTiles) => {
    const sorted = [...activeTiles].sort((a,b) => a.id-b.id);
    if (sorted.length<1) return console.log('error: no active tiles');
    else this.tabScore(sorted);
  }

  tabScore = (sortedTiles) => {
    const activeTiles = [...this.state.activeTiles];
    const newBoard = [...this.state.gameBoard];
    const startTile = sortedTiles[0];
    const myWord = [startTile.stack[0]];
    const id = startTile.id;
    let myScore = startTile.stack.length;

    let tempScore = 0;
    let tempWord = [];

    //top row
    let above = (id < 19) ? null : startLook('above', startTile);
    console.log('above END',above);
    if (above) {
      addLetters(above[0],above[1]);
      return this.nextPlayer(myScore,newBoard);
    }

    //bottom row
    let below = (id > 79) ? null : startLook('below', startTile);
    console.log('below END',below);
    if (below) {
      addLetters(below[0],below[1]);
      return this.nextPlayer(myScore,newBoard);
    }

    //first column
    let left = (id % 10 === 0) ? null : startLook('left', startTile);
    console.log('left END',left);
    if (left) {
      addLetters(left[0],left[1]);
      return this.nextPlayer(myScore,newBoard);
    }

    //last column
    let right = (id-7 % 10 === 0) ? null : startLook('right', startTile);
    console.log('right END',right);
    if (right) {
      addLetters(right[0],right[1]);
      return this.nextPlayer(myScore,newBoard);
    }

    function addLetters(letters, score) {
      myWord.push(letters);
      const newWord = myWord.join('');
      myScore = myScore + score;
      console.log('addLetters',newWord,myScore);
      if (newWord.length < activeTiles.length) return console.log('error: loose tiles');
    }

    function startLook(direction,startTile) {
      let next,offset;
      if (direction === 'above') offset = -10;
      if (direction === 'below') offset = 10;
      if (direction === 'left') offset = -1;
      if (direction === 'right') offset = 1;
      next = newBoard.find(tile => tile.id === startTile.id+offset);
      if (next && next.stack.length>0) {
        tempWord.push(next.stack[0]);
        tempScore = tempScore + (next.stack.length);
        // console.log(direction,tempWord,'myScore',myScore,'RECURSE');
        return startLook(direction, next);
      } else if (tempWord.length>0) {
        const result = [tempWord.join(''),tempScore];
        tempWord=[];
        tempScore=0;
        return result;
      } else return null;
    }
  } // tabScore() END
} // App COMPONENT END
