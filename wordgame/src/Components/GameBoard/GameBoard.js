
import React from 'react';

const GameBoard = props => {
  let warning = String.fromCharCode(9888);
  let clickedHover = (props.clickedLetter.length>0) ? 'clickedHover' : '';
  if (!props.gameBoard) return (<div className="loading">Loading...</div>);
  else return ( 
    <section className={'GameBoard '+clickedHover}>
      <div className="message">{props.message.length>1 ? `${warning} ${props.message} ${warning}` : ''}</div>

    {props.gameBoard.map((tile, index) => {
      let myClassName = 'tile ';
      if (tile.active) myClassName += 'active '
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
        // console.log('myClassName',myClassName);
      }
      let clicked = (props.clickedLetter[2] === index) ? ' clicked' : '';
      
        return (
          <div 
            className={myClassName+clicked}
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
// standard 8
// scrabble 16
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
