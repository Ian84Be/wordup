import React from 'react';


const MessageModal = (props) => {

    let warning = String.fromCharCode(9888);
    return ( 
        <div className="MessageModal">
            {props.message.length>1 ? `${warning} ${props.message} ${warning}` : ''}
        </div>
    );
}

export default MessageModal;