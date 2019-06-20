import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayers} from '../../redux/actions'

import {drawLetters} from '../PlayerOne/PlayerOne';

const StartNewGame = (props) => {
    const [newPlayer, setnewPlayer] = useState({
        'name 1' : '',
        'name 2' : '',
        'name 3' : '',
        'name 4' : ''
    });
    const [numPlayers, setnumPlayers] = useState([]);

    const startNewGame = e => {
        e.preventDefault();
        console.log('START',newPlayer);
        let newPlayers = numPlayers.map((num, i) => ({
            id: i,
            myHistory: [],
            myLetters: drawLetters(7),
            myName: newPlayer[`name ${num}`],
            myScore: 0,
        }));
        console.log(newPlayers);
        props.addPlayers(newPlayers);
        // setnewPlayer({name:''});
    }

    console.log('StartNewGame props',props.players)
    return ( 
        <div className="StartNewGame">
            <h1 className="logo__big">WordUp</h1>
            <div className="headline">
                A 3-Dimensional Word Game
            </div>

            <div className="middle">
                    <p>How Many Players?</p>
                <div className="numberButtons">
                    <button className="num" onClick={() => setnumPlayers([1])}>1</button>
                    <button className="num" onClick={() => setnumPlayers([1,2])}>2</button>
                    <button className="num" onClick={() => setnumPlayers([1,2,3])}>3</button>
                    <button className="num" onClick={() => setnumPlayers([1,2,3,4])}>4</button>
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
                                        placeholder="...name"
                                        type="text" 
                                        value={newPlayer[`name ${num}`]} 
                                    />
                                </div>
                            )
                        })
                    ) : (<></>)}
                    {(numPlayers.length > 0) ? (<button className="start">Start Game</button>) : (<></>)}
                </form>
            </div>

        </div>
    );
}

export default connect(null,{addPlayers})(StartNewGame);