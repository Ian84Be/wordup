import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayer} from '../../redux/actions'

import {drawLetters} from '../PlayerOne/PlayerOne';

const AddPlayer = (props) => {
    const [newPlayer, setnewPlayer] = useState({
        name: ''
    });
    const handleSubmit = e => {
        e.preventDefault();
        console.log(newPlayer);
        const thisPlayer = {
            id: props.players.length,
            myHistory: [],
            myLetters: drawLetters(7),
            myName: newPlayer.name,
            myScore: 0,
        };
        console.log(thisPlayer);
        props.addPlayer(thisPlayer);
        setnewPlayer({name:''});
    };
    console.log('AddPlayer props',props.players)
    let warning = String.fromCharCode(9888);
    return ( 
        <div className="AddPlayer">
            <h1>WordUp</h1>

            <form onSubmit={(e) => handleSubmit(e)}>
                <p>Hello, Player {props.players.length+1}, what is your name?</p>
                <label htmlFor="name">My name is </label>
                <input 
                    id="name" 
                    onChange={(e) => setnewPlayer({name: e.target.value})}
                    type="text" 
                    value={newPlayer.name} 
                />
            </form>

            <div className="message">{props.message.length>1 ? `${warning} ${props.message} ${warning}` : ''}</div>

        </div>
    );
}

export default connect(null,{addPlayer})(AddPlayer);