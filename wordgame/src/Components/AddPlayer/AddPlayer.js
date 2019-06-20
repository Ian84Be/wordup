import React, {useState} from 'react';
import {connect} from 'react-redux';
import {addPlayers} from '../../redux/actions'


const AddPlayer = (props) => {

    let warning = String.fromCharCode(9888);
    return ( 
        <div className="AddPlayer">
            <h1>WordUp</h1>
            <div className="message">{props.message.length>1 ? `${warning} ${props.message} ${warning}` : ''}</div>
        </div>
    );
}

export default connect(null,{addPlayers})(AddPlayer);