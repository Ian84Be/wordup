import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayers,newLetterBag} from '../../redux/actions'
import {letterBag as startBag} from '../../letterBag.js';

const StartNewGame = (props) => {
    const [newPlayer, setnewPlayer] = useState({
        'name 1' : '',
        'name 2' : '',
        'name 3' : '',
        'name 4' : ''
    });
    const [numPlayers, setnumPlayers] = useState([]);

    const startNewGame = (e) => {
        e.preventDefault();
        let newPlayers = numPlayers.map((num, i) => ({
            id: i,
            myHistory: [],
            myLetters: startLetters(7),
            myName: newPlayer[`name ${num}`],
            myScore: 0,
        }));
        props.newLetterBag(startBag);
        return props.addPlayers(newPlayers);
    }

    function startLetters(num) {
        let myLetters=[], random_letter;
        for (let i = 0; i < num; i++) {
            let grabBag = Object.entries(startBag).filter(letter => letter[1]>0);
            let random = Math.floor(Math.random() * grabBag.length);
            random_letter = grabBag[random][0];
            myLetters.push(random_letter);
            --grabBag[random][1];
            startBag[random_letter] = grabBag[random][1];
        }
        return myLetters;
      }

    // function playerColor(e, color) {
    //     e.preventDefault();
    //     console.log(color);
    // }
    return ( 
        <div className="StartNewGame">
            <h1 className="logo__big">WordUp</h1>
            <div className="headline">A 3-Dimensional Word Game</div>

            <div className="playerForm">
                <p>How Many Players?</p>
                <div className="numberButtons">
                    <button className={numPlayers.length === 1 ? 'num active' : 'num'} onClick={() => setnumPlayers([1])}>1</button>
                    <button className={numPlayers.length === 2 ? 'num active' : 'num'} onClick={() => setnumPlayers([1,2])}>2</button>
                    <button className={numPlayers.length === 3 ? 'num active' : 'num'} onClick={() => setnumPlayers([1,2,3])}>3</button>
                    <button className={numPlayers.length === 4 ? 'num active' : 'num'} onClick={() => setnumPlayers([1,2,3,4])}>4</button>
                </div>
                <form onSubmit={(e) => startNewGame(e)}>
                    {(numPlayers.length > 0) ? (
                        numPlayers.map(num => {
                            return (
                                <div className="playerName" key={num}>
                                    <label htmlFor={`name ${num}`}>Player {num}</label>
                                    <input
                                        required 
                                        id={`name ${num}`} 
                                        onChange={(e) => setnewPlayer({...newPlayer,[`name ${num}`]: e.target.value})}
                                        placeholder="name"
                                        type="text" 
                                        value={newPlayer[`name ${num}`]} 
                                    />
                                    {/* <button className="color" style={{backgroundColor:'slateblue'}} onClick={e => playerColor(e,'slateblue')}></button>
                                    <button className="color" style={{backgroundColor:'orangered'}} onClick={e => playerColor(e,'orangered')}></button>
                                    <button className="color" style={{backgroundColor:'burlywood'}} onClick={e => playerColor(e,'burlywood')}></button>
                                    <button className="color" style={{backgroundColor:'firebrick'}} onClick={e => playerColor(e,'firebrick')}></button> */}
                                </div>
                            )
                        })
                    ) : (<></>)}
                    {(numPlayers.length > 0) ? (<button className="start">Start Game</button>) : (<></>)}
                </form>
            </div>
            
                    <h2>HOW - TO - PLAY</h2>
            <div className="rules">
                    <p>Place tiles on the board to build words!</p>
                    <p>The first player must cover <em>one or more</em> of the four <em>central squares</em>.</p>
                    <p>All tiles played on a turn must form part of one continuous line of tiles <em>vertical </em> or <em>horizontal</em>.</p>
                    <h3>Scoring</h3>
                    <p>Words built with stacked letters score <em>1 point</em> per tile in the stack.</p>
                    <p>Words built with <em>no stacked letters</em> score <em>2 points</em> per tile.</p>
                    <p>2 <em>bonus points</em> for using "Qu" in a word with <em>no stacked letters</em>.</p>
                    <p>20 <em>bonus points</em> for using all seven tiles in one turn.</p>
                    <h3>End Game</h3>
                    <p>The <em>game ends </em> when letterBag is empty and one player has used all of his/her tiles, or
                    when letterBag is empty and every player passes in a single round.</p>
                    <p>Players lose <em>5 points</em> for each unused tile they hold at the end of the game.</p>
                    <h3>Player Controls</h3>
                    <p>PASS >> Pass your turn and draw seven new letters</p>
                    <p>SHUFFLE >> Shuffle the display of your letters</p>
                    <p>SUBMIT >> Submit played words for scoring</p>
                    <p>CLEAR BOARD >> Clear all activeTiles from the GameBoard</p>
            </div>


        </div>
    );
}

export default connect(null,{addPlayers,newLetterBag})(StartNewGame);