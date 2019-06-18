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
            id: props.players.length+1,
            name:newPlayer.name
        };
        props.addPlayer(thisPlayer);
        setnewPlayer({name:''});
    };
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
            {props.players.map(player => {
                return (
                    <div className="player" key={player.id}>
                        <li>id:{player.id}</li>
                        <li>{player.name}</li>
                    </div>
                )
            })}
        </div>
    );
}

const mapStateToProps = state => ({
    players: state.players
});
 
export default connect(mapStateToProps, {addPlayer})(AddPlayer);