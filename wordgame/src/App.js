import React from 'react';
import './App.scss';

const myGrid = boardMaker(8);

export default class App extends React.Component {
  state = { 
    myLetters:['A','Z','T','G','Qu','X','M','Y'],
    myScore:0,
    gameBoard: myGrid
  };

  render() { 
    console.log('reRENDER')
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

	onDragStart = (e, letter) => {
    console.log('dragstart on div: ', e.target, letter);
    e.dataTransfer.setData("letter", letter);
    console.log('onDragStarte END',e.dataTransfer.getData("letter"));
  }

  onDragOver = e => {
      e.preventDefault();
  }

  onDrop = (e, tileId) => {
    console.log('onDrop',tileId);
    let letter = e.dataTransfer.getData("letter");
    let indexNo = this.state.gameBoard.findIndex(tile => tile.id === tileId);
    
    let newBoard = [...this.state.gameBoard];
    let thisTile = newBoard[indexNo];
    thisTile.face = letter;
    thisTile.stack = Number(thisTile.stack + 1);
    console.log(thisTile);

    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard
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
          stack: '0',
      })
    }
  }
  return myGrid;
}
// console.log(boardMaker(2));
