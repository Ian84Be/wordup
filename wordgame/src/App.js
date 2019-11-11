import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from './useLocalStorage';

import { loadDictionary } from './redux/config/configActions';
import { makeBoard } from './redux/config/configActions';

import MiniScores from './Components/MiniScores/MiniScores';
import GameBoard, { boardMaker } from './Components/GameBoard/GameBoard.js';
import MessageModal from './Components/MessageModal/MessageModal.js';
import PlayerControls from './Components/PlayerControls/PlayerControls.js';
import StartNewGame from './Components/StartNewGame/StartNewGame.js';

import History from './Components/History/History';
import HowToModal from './Components/HowTo/HowToModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faListAlt } from '@fortawesome/free-solid-svg-icons';

import './App.scss';

const App = () => {
  const dispatch = useDispatch();
  const [l_gameBoard] = useLocalStorage('gameBoard', '');
  const [l_players] = useLocalStorage('players', '');
  const players = useSelector(s => s.players.players);
  const message = useSelector(s => s.commo.message);
  const errMsg = useSelector(s => s.commo.errMsg);

  useEffect(() => {
    // TODO
    // create config object
    // DEFAULT config object >> 'wordUp rules' = setRules(build oneWay, waitTurn, 8board)
    // toggle config obj >> 'fast rules' = setRules(build bothWays, loseTurn, 6board)
    // dictionary >> find something better? (missing modern words like zen, crunk)
    if (l_gameBoard.length > 0) {
      dispatch(makeBoard(l_gameBoard));
    } else {
      const myGrid = boardMaker(8);
      dispatch(makeBoard(myGrid));
    }
    import('./scrabbleWordList.js').then(dictionary => {
      dispatch(loadDictionary(dictionary.default));
    });
  }, [dispatch, l_gameBoard]);

  const [history, showHistory] = useState(false);
  const [howTo, showHowTo] = useState(false);

  if (players.length < 1 && l_players.length < 1) {
    return <StartNewGame />;
  } else {
    return (
      <div className="App">
        <header>
          <FontAwesomeIcon icon={faListAlt} onClick={() => showHistory(true)} />
          <h1>WordUp</h1>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            onClick={() => showHowTo(true)}
          />
        </header>

        {history && <History showHistory={showHistory} />}
        {howTo && <HowToModal showHowTo={showHowTo} />}

        {errMsg.length > 0 && <MessageModal message={errMsg} />}
        {message.length > 0 && <MessageModal message={message} />}

        <MiniScores />
        <GameBoard />
        <PlayerControls />
      </div>
    );
  }
};

export default App;
