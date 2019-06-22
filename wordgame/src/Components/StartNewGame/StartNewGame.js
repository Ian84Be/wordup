import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayers,newLetterBag} from '../../redux/actions'
import {letterBag} from '../../letterBag.js';
let startBag = {...letterBag};


const StartNewGame = (props) => {
    const [newPlayer, setnewPlayer] = useState({
        'name 1' : '',
        'name 2' : '',
        'name 3' : '',
        'name 4' : ''
    });
    const [numPlayers, setnumPlayers] = useState([]);

    const startNewGame = async (e) => {
        e.preventDefault();
        let newPlayers = numPlayers.map((num, i) => ({
            id: i,
            myHistory: [],
            myLetters: startLetters(7),
            myName: newPlayer[`name ${num}`],
            myScore: 0,
        }));
        // console.log({newPlayers});
        // console.log('startNewGame() DONE >> update letterBag',startBag)
        props.newLetterBag(startBag);
        return props.addPlayers(newPlayers);
    }

    function startLetters(num) {
        // console.log('startLetters() startBag',startBag);
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

    function playerColor(e, color) {
        e.preventDefault();
        console.log(color);
    }
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
                                    <button className="color" style={{backgroundColor:'slateblue'}} onClick={e => playerColor(e,'slateblue')}></button>
                                    <button className="color" style={{backgroundColor:'orangered'}} onClick={e => playerColor(e,'orangered')}></button>
                                    <button className="color" style={{backgroundColor:'burlywood'}} onClick={e => playerColor(e,'burlywood')}></button>
                                    <button className="color" style={{backgroundColor:'firebrick'}} onClick={e => playerColor(e,'firebrick')}></button>
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

export default connect(null,{addPlayers,newLetterBag})(StartNewGame);