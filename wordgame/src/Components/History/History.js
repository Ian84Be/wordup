import React from 'react';

const History = (props) => {
  return (
    <div className="History">
      <h3>HISTORY</h3>
      

        {props.errMsg.length>0 && (
            <div className="errorMessage">{`${props.errMsg}`}</div>
        )}
      
        {props.message.length>0 && (
            <div className="MessageModal">{`${props.message}`}</div>
        )}

        <div className="gameHistory__container">
            {props.gameHistory.map((turn,i) => {
                return (
                <div key={i + Math.random()} className="gameHistory">
                    {turn}
                </div>
                )
            })}
        </div>
      
    </div>
  );
}
 
export default History;


//   {/* <History
//     activePlayer={activePlayer}
//     errMsg={errMsg}
//     gameHistory={gameHistory}
//     letterBag={letterBag}
//     message={message} 
//     myHistory={myHistory}
//     myName={myName}
//     myScore={myScore}
//     passTurn={this.passTurn}
//     players={players}
//   /> */}