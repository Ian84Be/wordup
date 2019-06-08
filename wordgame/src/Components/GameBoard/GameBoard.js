
import React from 'react';

const GameBoard = props => {
  return ( 
    <section className="GameBoard">
    {props.gameBoard.map((tile, index) => {
        return (
          <div 
            className={(props.activeTiles.filter(activeTile => activeTile.id === tile.id).length>0) ? 'active tile' : 'tile'}
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
