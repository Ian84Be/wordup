import React from 'react';
import './App.scss';

export default class App extends React.Component {
  state = { 
    activeTiles:[],
    gameBoard:[],
    myLetters:[],
    myScore:0,
  };

  componentDidMount() {
    const myGrid = boardMaker(8);
    const myNewLetters = drawLetters(8).split('');
    this.setState(prevState => ({
      ...prevState,
      gameBoard: myGrid,
      myLetters: myNewLetters
    }))
  }

  render() { 
    const {activeTiles, myLetters, gameBoard} = this.state;
    // console.log('reRender ACTIVE TILES',activeTiles);
    return ( 
      <div className="container">
      <section className="left-side">
        <h2>myLetters</h2>
        <div className="myLetters">
          {myLetters.map(letter => {
              return (
                <div 
                  className="letter"
                  draggable
                  key={(Math.random() * 100)}
                  onDragStart={e => this.onDragStart(e, letter)}
                >
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
        {gameBoard.map((tile, index) => {
            return (
              <div 
                className="tile"
                key={tile.id} 
                onClick={e => this.boardClick(e, index)}
                onDragOver={e => e.preventDefault()}
                onDrop={e => this.onDrop(e, index)}
              >
                {tile.stack[0] || ''}
              </div>
            )
          })}
      </section>
    </div> 
    );
  } // render() END

  boardClick = (e, index) => {
    e.preventDefault();
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
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

	onDragStart = (e, letter) => {
    e.dataTransfer.setData("letter", letter);
  }

  onDrop = (e, index) => {
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    // this controls whether you can drop more than one letter per tile
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
    this.tabScore(sorted);
  }

  tabScore = (sortedTiles) => {
    // console.log('sortedTiles',sortedTiles);
    if (sortedTiles.length<1) return;
    const newBoard = [...this.state.gameBoard];
    const startTile = sortedTiles[0];
    const myWord = [startTile.stack[0]];
    let myScore = startTile.stack.length;
    console.log('myWord:',myWord.join(''),'myScore',myScore);
    // if (sortedTiles[0].id < 20) console.log('first row')

    // FIRST COLUMN look ABOVE, BELOW, RIGHT
    if (startTile.id % 10 === 0) {
      // look ABOVE
      let above = newBoard.find(tile => tile.id === startTile.id - 10);
      if (above && above.stack.length>0) console.log(above.stack[0], 'is above');
      else console.log('nothing above');

      startLook('right', startTile);

      function startLook(direction,startTile) {
        let next;
        if (direction === 'right') next = newBoard.find(tile => tile.id === startTile.id + 1 );
        if (next && next.stack.length>0) {
          myWord.push(next.stack[0]);
          myScore = myScore + (next.stack.length);
          console.log('myWord:',myWord.join(''),'myScore',myScore,'RECURSE');
          startLook('right', next);
        }
        else console.log('endLook');
      }

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
  // TODO
  // add function to guarantee ONE VOWEL && ONE CONSONANT
  // add function to combine Q+u
  return random_string;
}

// TODO
// custom boards
// 3 square with non-playable center, outer-wall only
// standard 8
// scrabble 16
function boardMaker(gridsize) {
  const myGrid = [];
  for (let i=1;i<=gridsize;i++) {
    for (let j=0;j<gridsize;j++) {
      myGrid.push({
          id: Number(`${i}${j}`),
          // face: '',
          stack: [],
      })
    }
  }
  return myGrid;
}
