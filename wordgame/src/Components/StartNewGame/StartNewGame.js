import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayers} from '../../redux/actions'

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
            myLetters: [],
            myName: newPlayer[`name ${num}`],
            myScore: 0,
        }));
        await newPlayers.forEach((player) => {
            player.myLetters = props.getLetters(7);
        });
        console.log({newPlayers});
        return props.addPlayers(newPlayers);
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

export default connect(null,{addPlayers})(StartNewGame);