
import React from 'react';

const GameBoard = props => {
  // let clickedHover = (props.clickedLetter.length>0) ? 'clickedHover' : '';
  if (!props.gameBoard) return (<div className="loading">Loading...</div>);
  else return ( 
    // <section className={'GameBoard '+clickedHover}>
    <section className={'GameBoard'}>

    {props.gameBoard.map((tile, index) => {
      let myClassName = 'tile ';
      if (tile.active) myClassName += 'active ';
      if (props.clickedLetter[2] === index) myClassName += 'clicked ';
      if (tile.stack.length>0) myClassName += 'x'.repeat(tile.stack.length);
      else if (tile.stack.length===0) myClassName += 'blank';
      
        return (
          <div 
            className={myClassName}
            draggable
            key={tile.id} 
            onClick={e => props.boardClick(e, index, tile.active)}
            onDragStart={e => props.onDragStart(e, index, tile.active)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => props.onDrop(e, index, tile.active)}
          >
            {tile.stack[0] || ''}
            <small>{tile.stack.length>1 ? tile.stack.length : ''}</small>
          </div>
        )
      })}

    </section>
  );
}

// TODO
// custom boards
// 3 square with non-playable center, outer-wall only
// classic 8x8
// International Standard 10x10
// Scrabble (15x15, premium tiles)
export function boardMaker(gridsize) {
  const myGrid = [];
  for (let i=1;i<=gridsize;i++) {
    for (let j=0;j<gridsize;j++) {
      myGrid.push({
        active:false,
        id: Number(`${i}${j}`),
        stack: [],
      })
    }
  }
  return myGrid;
}
 
export default GameBoard;
