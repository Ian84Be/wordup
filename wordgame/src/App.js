import React from 'react';
import './App.scss';

const myGrid = boardMaker(8);

export default class App extends React.Component {
  state = { 
    activeTiles:[],
    myLetters:[],
    myScore:0,
    myWord:'',
    gameBoard: myGrid
  };

  componentDidMount() {
    console.log('componentDidMount');
    const myNewLetters = drawLetters(8).split('');
    this.setState(prevState => ({
      ...prevState,
      myLetters: myNewLetters
    }))
  }

  render() { 
    const {activeTiles, myLetters, gameBoard} = this.state;
    console.log('reRender ACTIVE TILES',activeTiles);
    return ( 
      <div className="container">
      <section className="left-side">
        <h2>myLetters</h2>
        <div className="myLetters">
          {myLetters.map(letter => {
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
        <div className="controls">
          <button onClick={() => this.submitWord(activeTiles)}>Submit</button>
        </div>
      </section>

      <section className="board">
        {gameBoard.map(tile => {
            return (
              <div 
                className="tile"
                key={tile.id} 
                onDragOver={e => e.preventDefault()}
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
    const {activeTiles, myLetters, gameBoard} = this.state;

    const indexNo = gameBoard.findIndex(tile => tile.id === tileId);
    const newBoard = [...gameBoard];
    const thisTile = newBoard[indexNo];
    console.log(thisTile);
    const thisLetter = thisTile.face;
    if (!thisLetter) return;

    const myNewLetters = [...myLetters, thisLetter];
    if (thisTile.stack.length > 0) {
      const newFace = thisTile.stack.shift();
      thisTile.face = newFace;
    } else thisTile.face = '';

    const activeIndex = activeTiles.findIndex(tile => tile.id === tileId);
    const newActive = [...activeTiles];
    newActive.splice(activeIndex,1);

    this.setState(prevState => ({
      ...prevState,
      activeTiles: newActive,
      gameBoard: newBoard,
      myLetters: myNewLetters
    }));
  }

	onDragStart = (e, letter) => {
    e.dataTransfer.setData("letter", letter);
  }

  onDrop = (e, tileId) => {
    const {activeTiles, myLetters, gameBoard} = this.state;
    const letter = e.dataTransfer.getData("letter");
    const indexNo = gameBoard.findIndex(tile => tile.id === tileId);
    const newBoard = [...gameBoard];
    const thisTile = newBoard[indexNo];
    if (activeTiles.includes(thisTile)) return;
    const oldFace = `${thisTile.face}`;
    thisTile.face = letter;
    if (oldFace !== '') thisTile.stack.unshift(oldFace);
    const myNewLetters = [...myLetters];
    myNewLetters.splice(myNewLetters.indexOf(letter),1)

    this.setState(prevState => ({
      ...prevState,
      activeTiles: [...prevState.activeTiles, thisTile],
      gameBoard: newBoard,
      myLetters: myNewLetters
    }));
  } // onDrop() END

  submitWord = (activeTiles) => {
    const sorted = [...activeTiles].sort((a,b) => a.id-b.id);
    // console.log('sorted',sorted);
    this.tabScore(sorted);
  }

  tabScore = (sortedTiles) => {
    if (sortedTiles.length<1) return;
    console.log('sortedTiles',sortedTiles);
    let myScore = 0;
    // if (sortedTiles[0].id < 20) console.log('first row')
    if (sortedTiles[0].id % 10 === 0) {
      console.log('first column');

    }
  }
} // App COMPONENT END

// from https://codehandbook.org/generate-random-string-characters-in-javascript/
function drawLetters(num) {
  let random_string = '', random_ascii;
  let ascii_low = 65, ascii_high = 90;
  for(let i = 0; i < num; i++) {
      random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
      random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}
// console.log(drawLetters(8))

function boardMaker(gridsize) {
  const myGrid = [];
  for (let i=1;i<=gridsize;i++) {
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
// console.log(boardMaker(8));
