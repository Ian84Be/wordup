import React from 'react';

const HowTo = () => {
  return (
    <section className="HowTo">
      <h2>HOW - TO - PLAY</h2>
      <div className="rules">
        <ul>
          <li>
            <p>Place tiles on the board to build words!</p>
          </li>
          <li>
            <p>
              The first player must cover <em>one or more</em> of the four{' '}
              <em>central squares</em>.
            </p>
          </li>
          <li>
            <p>
              All tiles played on a turn must form part of one continuous line
              of tiles <em>vertical </em> or <em>horizontal</em>.
            </p>
          </li>

          <h3>Scoring</h3>
          <li>
            <p>
              Words built with stacked letters score <br />
              <em>1 point</em> per tile in the stack.
            </p>
          </li>
          <li>
            <p>
              Words built with <em>no stacked letters</em> score{' '}
              <em>2 points</em> per tile.
            </p>
          </li>
          <li>
            <p>
              2 <em>bonus points</em> for using "Qu" in a word with{' '}
              <em>no stacked letters</em>.
            </p>
          </li>
          <li>
            <p>
              20 <em>bonus points</em> for using all seven tiles in one turn.
            </p>
          </li>

          <h3>End Game</h3>
          <li>
            <p>
              The <em>game ends </em> when letterBag is empty and one player has
              used all of their tiles, or when letterBag is empty and every
              player passes in a single round.
            </p>
          </li>
          <li>
            <p>
              Players lose <em>5 points</em> for each unused tile they hold at
              the end of the game.
            </p>
          </li>

          <h3>Player Controls</h3>
          <li>
            <p>PASS >> Pass your turn and draw seven new letters</p>
          </li>
          <li>
            <p>SHUFFLE >> Shuffle the display of your letters</p>
          </li>
          <li>
            <p>SUBMIT >> Submit played words for scoring</p>
          </li>
          <li>
            <p>CLEAR BOARD >> Clear all activeTiles from the GameBoard</p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HowTo;
