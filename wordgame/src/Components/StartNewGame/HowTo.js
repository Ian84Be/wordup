import React, { useState } from 'react';

const HowTo = () => {
  const [showing, setShowing] = useState(0);
  const allCards = [card1, card2, card3, card4];

  const handleClick = direction => {
    console.log('handleclick() dire', direction);
    console.log('handleclick() showing', showing);
    if (direction === 'prev') {
      return showing - 1 >= 0
        ? setShowing(showing - 1)
        : setShowing(allCards.length - 1);
    } else {
      return showing + 1 < allCards.length
        ? setShowing(showing + 1)
        : setShowing(0);
    }
  };

  return (
    <section className="HowTo">
      <main>
        {allCards.map((c, i) => {
          if (i === showing) return c();
          else return null;
        })}
      </main>
      <footer>
        <button onClick={() => handleClick('prev')}>{'<<'}</button>
        {allCards.map((c, i) => {
          return <div className={i === showing ? 'step active' : 'step'}></div>;
        })}
        <button onClick={() => handleClick('next')}>{'>>'}</button>
      </footer>
    </section>
  );
};

export default HowTo;

function card1() {
  return (
    <div className="HowTo--card">
      <h2>HOW - TO - PLAY</h2>
      <p>Place tiles on the board to build words!</p>
      <p>
        The first player must cover <em>one or more</em> of the four{' '}
        <em>central squares</em>.
      </p>
      <p>
        All tiles played on a turn must form part of one continuous line of
        tiles <em>vertical </em> or <em>horizontal</em>.
      </p>
    </div>
  );
}

function card2() {
  return (
    <div className="HowTo--card">
      <h3>Scoring</h3>
      <p>
        Words built with stacked letters score <br />
        <em>1 point</em> per tile in the stack.
      </p>
      <p>
        Words built with <em>no stacked letters</em> score <em>2 points</em> per
        tile.
      </p>
      <p>
        2 <em>bonus points</em> for using "Qu" in a word with{' '}
        <em>no stacked letters</em>.
      </p>
      <p>
        20 <em>bonus points</em> for using all seven tiles in one turn.
      </p>
    </div>
  );
}

function card3() {
  return (
    <div className="HowTo--card">
      <h3>End Game</h3>
      <p>
        The <em>game ends </em> when letterBag is empty and one player has used
        all of their tiles, or when letterBag is empty and every player passes
        in a single round.
      </p>
      <p>
        Players lose <em>5 points</em> for each unused tile they hold at the end
        of the game.
      </p>
    </div>
  );
}

function card4() {
  return (
    <div className="HowTo--card">
      <h3>Player Controls</h3>
      <p>
        <em>PASS</em> >> Pass your turn and draw seven new letters
      </p>
      <p>
        <em>SHUFFLE</em> >> Shuffle the display of your letters
      </p>
      <p>
        <em>SUBMIT</em> >> Submit played words for scoring
      </p>
      <p>
        <em>CLEAR BOARD</em> >> Clear all activeTiles from the GameBoard
      </p>
    </div>
  );
}
