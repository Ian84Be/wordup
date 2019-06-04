import React from 'react';
import './App.scss';

const myGrid = boardMaker(8);

export default class App extends React.Component {
  state = { 
    myLetters:['A','Z','E','Qu','E','E','Z','Y'],
    myScore:0,
    gameBoard: myGrid
  };

  render() { 
    return ( 
      <div className="container">
      <section className="left-side">
        <h2>myLetters</h2>
        <div className="myLetters">
          {this.state.myLetters.map(letter => {
              return (
                <div 
                  className="letter"
                  onDragStart={e => this.onDragStart(e, letter)}
                  key={(Math.random() * 100)}
                draggable>
                  {letter}
                </div>
              )
            })}
        </div>
      </section>

      <section className="board">
        {this.state.gameBoard.map(tile => {
            return (
              <div 
                className="tile"
                key={tile.id} 
                onDragOver={e => this.onDragOver(e)}
                onClick={e => this.boardClick(e, tile.id)}
                onDrop={e => this.onDrop(e, tile.id)}
              >
                {tile.face}
              </div>
            )
          })}
      </section>
    </div> 
    );
  } // render() END

  boardClick = (e, tileId) => {
    e.preventDefault();
    let indexNo = this.state.gameBoard.findIndex(tile => tile.id === tileId);
    let newBoard = [...this.state.gameBoard];
    let thisTile = newBoard[indexNo];
    let thisLetter = thisTile.face;
    if (!thisLetter) return;

    let myNewLetters = [...this.state.myLetters, thisLetter];
    if (thisTile.stack.length > 0) {
      let newFace = thisTile.stack.shift();
      thisTile.face = newFace;
    } else thisTile.face = '';

    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      myLetters: myNewLetters
    }));
  }

	onDragStart = (e, letter) => {
    e.dataTransfer.setData("letter", letter);
  }

  onDragOver = e => {
      e.preventDefault();
  }

  onDrop = (e, tileId) => {
    let letter = e.dataTransfer.getData("letter");
    let indexNo = this.state.gameBoard.findIndex(tile => tile.id === tileId);
    let newBoard = [...this.state.gameBoard];
    let thisTile = newBoard[indexNo];
    let oldFace = `${thisTile.face}`;
    thisTile.face = letter;
    if (oldFace !== '') thisTile.stack.unshift(oldFace);

    // remove data from myLetters
    let myNewLetters = [...this.state.myLetters];
    myNewLetters.splice(myNewLetters.indexOf(letter),1)

    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      myLetters: myNewLetters
    }));
  } // onDrop() END
} // App COMPONENT END

function boardMaker(gridsize) {
  let myGrid = [];
  for (let i=0;i<gridsize;i++) {
    for (let j=0;j<gridsize;j++) {
      myGrid.push({
          id: `${i}${j}`,
          face: '',
          stack: [],
      })
    }
  }
  return myGrid;
}
// console.log(boardMaker(2));
