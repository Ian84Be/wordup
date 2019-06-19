import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayer} from '../../redux/actions'

const AddPlayer = (props) => {
    const [newPlayer, setnewPlayer] = useState({
        name: ''
    });
    const handleSubmit = e => {
        e.preventDefault();
        console.log(newPlayer);
        const thisPlayer = {
            id: props.players.length,
            name:newPlayer.name
        };
        props.addPlayer(thisPlayer);
        setnewPlayer({name:''});
    };
    console.log('AddPlayer props',props.players)
    return ( 
        <div className="AddPlayer">
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="name">Name</label>
                <input 
                    id="name" 
                    onChange={(e) => setnewPlayer({name: e.target.value})}
                    type="text" 
                    value={newPlayer.name} 
                />
            </form>
            <div className="activePlayer">activePlayer:{props.activePlayer}</div>
            {props.players.map(player => {
                console.log({player});
                console.log(player.myLetters);
                console.log(player.id);
                console.log(player.myScore);
                return (
                    <div className="player" key={player.id}>
                        <li>{player.myName}: {player.myScore}</li>
                        <li>{player.myLetters}</li>
                        <li>{player.myHistory}</li>
                    </div>
                )
            })}
        </div>
    );
}

export default AddPlayer;