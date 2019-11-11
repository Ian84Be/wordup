import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPlayers,
  setActivePlayer
} from '../../redux/players/playersActions';
import { useLocalStorage } from '../../useLocalStorage';

const MiniScores = () => {
  const [l_activePlayer] = useLocalStorage('activePlayer', '');
  const [l_players] = useLocalStorage('players', '');
  const [showing, setShowing] = useState([]);

  const dispatch = useDispatch();
  const activePlayer = useSelector(s => s.players.activePlayer);
  const players = useSelector(s => s.players.players);

  useEffect(() => {
    if (players.length === 0 && l_players.length > 0) {
      dispatch(addPlayers(l_players));
      dispatch(setActivePlayer(l_activePlayer));
    } else {
      setShowing(players);
    }
  }, [dispatch, l_activePlayer, l_players, players, showing]);

  return (
    <div className="MiniScores">
      {showing.map(player => {
        return (
          <div
            key={player.id}
            className={
              player.id === activePlayer ? 'active playerCard' : 'playerCard'
            }
          >
            {player.myName}: {player.myScore === 0 ? '0' : player.myScore}
          </div>
        );
      })}
    </div>
  );
};

export default MiniScores;
