
import React from 'react';

const GameBoard = props => {
  return ( 
    <section className="GameBoard">

    {props.gameBoard.map((tile, index) => {
      let myClassName = 'tile ';
      const isActive = (props.activeTiles.filter(activeTile => activeTile.id === tile.id).length>0);
      if (isActive) myClassName += 'active '
      if (tile.stack.length>0) {
        let stack = '';
        for (let i=0,j=0;i<tile.stack.length;i++) {
          j = i;
          while (j>-1) {
            stack += 'x';
            j--;
          }
          stack += ' ';
        }
        myClassName += stack;
      }

        return (
          <div 
            className={myClassName}
            draggable
            key={tile.id} 
            onClick={e => props.boardClick(e, index)}
            onDragStart={e => props.onDragStart(e, index)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => props.onDrop(e, index)}
          >
            {tile.stack[0] || ''}
            <small>{tile.stack.length}</small>
          </div>
        )
      })}

    </section>
  );
}

// TODO
// custom boards
// 3 square with non-playable center, outer-wall only
// standard 8
// scrabble 16
export function boardMaker(gridsize) {
  const myGrid = [];
  for (let i=1;i<=gridsize;i++) {
    for (let j=0;j<gridsize;j++) {
      myGrid.push({
          id: Number(`${i}${j}`),
          stack: [],
      })
    }
  }
  return myGrid;
}
 
export default GameBoard;
