
import React from 'react';
import GameBoard, {boardMaker} from './Components/GameBoard/GameBoard.js';
import PlayerOne, {drawLetters} from './Components/PlayerOne/PlayerOne.js';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard.js'
import scrabbleWordList from './scrabbleWordList.js';
import './App.scss';

export default class App extends React.Component {
  state = { 
    activeTiles:[],
    gameBoard:[],
    message: '',
    myHistory:[],
    myLetters:[],
    myScore:0,
  };
  render() { 
    const {activeTiles, myLetters,myScore, gameBoard} = this.state;
    return ( 
      <div className="container">
        <PlayerOne 
          myLetters={myLetters}
          myScore={myScore}
          onDragStart={this.onDragStart}
          submitLetters={() => this.submitLetters(activeTiles)}
        />

        <GameBoard 
          activeTiles={this.state.activeTiles}
          boardClick={this.boardClick}
          gameBoard={gameBoard}
          onDragStart={this.onDragStart}
          onDrop={this.onDrop}
        />

        <ScoreBoard
          message={this.state.message}
          myHistory={this.state.myHistory}
          myScore={this.state.myScore}
          passTurn={this.passTurn}
        />
    </div> 
    );
  } // render() END
    componentDidMount() {
    // TODO
    // create config object
    // DEFAULT config object >> 'wordUp rules' = setRules(build oneWay, waitTurn, 8board)
    // toggle config obj >> 'fast rules' = setRules(build bothWays, loseTurn, 6board)
    // toggle config obj >> guarantee ONE VOWEL
    // toggle config obj >> combine Qu
    const myGrid = boardMaker(8);
    // const myNewLetters = drawLetters(8);
    const myNewLetters = ['T','Qu','E','B','S','I','N','K'];
    this.setState(prevState => ({
      ...prevState,
      gameBoard: myGrid,
      myLetters: myNewLetters
    }))
  }

  boardClick = (e, index) => {
    e.preventDefault();
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    if (!activeTiles.includes(thisTile)) return;
    const thisLetter = thisTile.stack.shift();
    if (!thisLetter) return;
    const myNewLetters = [...myLetters, thisLetter];
    const newActive = [...activeTiles];
    newActive.splice(newActive.findIndex(tile => tile.id === thisTile.id),1);

    this.setState(prevState => ({
      ...prevState,
      activeTiles: newActive,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  nextPlayer = (addScore) => {
    const oldLetters = [...this.state.myLetters];
    let newLetters=[],randomLetters=[];
    if (addScore === 0) newLetters = drawLetters(8);
    if (this.state.myLetters.length<8) {
      randomLetters = drawLetters(8-this.state.myLetters.length);
      newLetters = [...oldLetters,...randomLetters];
    }
    // TODO
    // powerup E9 tile if theirScore - myScore > 40
    // toggle config obj >> guarantee ONE VOWEL
    // fix so that hand INCLUDES one vowel >> put this on App method for nextPlayer
    const vowels = ['A','E','I','O','U'];
    let hasVowel = 0;
    vowels.forEach(vowel => {
      if (newLetters.includes(vowel)) ++hasVowel;
    });
    if (!hasVowel) {
      let randomV = vowels[Math.floor(Math.random()*5)];
      console.log('randomV',randomV);
      newLetters.pop();
      newLetters.push(randomV);
    }
    this.setState(prevState => ({
      ...prevState,
      activeTiles:[],
      message: '',
      myLetters: newLetters,
      myScore: prevState.myScore + addScore
    }))
  }

  onDragStart = (e, index) => {
    // console.log('dragSTART e.target',e.target);
    // console.log('dragSTART index',index);
    if (typeof(index) !== 'number') return e.dataTransfer.setData("letter", index);
    const {activeTiles, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const thisTile = newBoard[index];
    if (!activeTiles.includes(thisTile)) return e.dataTransfer.setData("letter", "blank");
    if (e.target.classList.contains('active')) {
      e.dataTransfer.setData("incomingIndex", index);
      e.dataTransfer.setData("letter", thisTile.stack[0]);
    } 
  }

  onDrop = (e, droppedOnIndex) => {
    const letter = e.dataTransfer.getData("letter");
    if (letter === 'blank' || letter === 'undefined' ) return console.log('error: cannot move inactive tile');
    
    const {activeTiles, myLetters, gameBoard} = this.state;
    const newBoard = [...gameBoard];
    const droppedOnTile = newBoard[droppedOnIndex];
    let myNewLetters = [...myLetters];
    let newActiveTiles = [...activeTiles];
    if (activeTiles.includes(droppedOnTile)) return console.log('error: cannot replace active tile');
    if (droppedOnTile.stack[0] === letter) return console.log('error: cannot duplicate letter');

    const incomingIndex = e.dataTransfer.getData("incomingIndex");
    if (incomingIndex) {
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      droppedOnTile.stack.unshift(letter);
      newActiveTiles.splice(newActiveTiles.findIndex(tile => tile.id === incomingTile.id),1);
      newActiveTiles = [...newActiveTiles, droppedOnTile];
    }
    
    if (!incomingIndex) {
      myNewLetters.splice(myNewLetters.indexOf(letter),1)
      droppedOnTile.stack.unshift(letter);
      newActiveTiles = [...activeTiles, droppedOnTile];
    } 

    this.setState(prevState => ({
      ...prevState,
      activeTiles: newActiveTiles,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  passTurn = () => {
    if (this.state.activeTiles.length>0) return this.setState(() => ({message: 'cannot pass with tiles in play'}));
    this.nextPlayer(0);
  }

  submitLetters = (activeTiles) => {
    const sorted = [...activeTiles].sort((a,b) => a.id-b.id);
    if (sorted.length<1) return this.setState(() => ({message: 'you havent placed any tiles!'}));
    else this.findWords(sorted);
  }

  scoreWords = (foundWords) => {
    console.log('scoreWords = (foundWords)',foundWords);
    // TODO
    // double strict scoring >> lose turn if dictionary FAIL
    const {activeTiles} = this.state;
    const activeIds = [];
    activeTiles.forEach(tile => activeIds.push(tile.id));

    if (!strictModeScoring(foundWords)) return console.log('error: strictModeScoring VIOLATION');

    function strictModeScoring(foundWords) {
      // pull ids for vertWord && horWord
      let vertWay = [];
      let horWay = [];
      foundWords.forEach((tileSet, index) => {
        console.log('tileSet',tileSet);
        let vertWord = [];
        let horWord = [];
        let lastId = '';
          tileSet.forEach((tile,i) => {
            let nextTile = tileSet[i+1];
            if (!nextTile) return lastId = tile.id;
            if (tile.id + 10 === nextTile.id ) vertWord.push(tile.id);
            if (tile.id + 1 === nextTile.id ) horWord.push(tile.id);
          });
        if (vertWord.length>0) {
          vertWord.push(lastId);
          vertWay.push(...vertWord);
        }
        if (horWord.length>0) {
          horWord.push(lastId);
          horWay.push(...horWord);
        }
        console.log('vertWord',vertWord,'horWord',horWord);
      });
      console.log('vertWay',vertWay,'horWay',horWay);
      console.log('activeIds',activeIds);

      // strictModeScoring() START
      // strict scoring mode >> force players to build in ONE DIRECTION ONLY
      if (vertWay.length>0 && horWay.length>0) {
        let vertAct = 0;
        let horAct = 0;
        activeIds.forEach(id => {
          if (vertWay.includes(id)) ++vertAct;
          if (horWay.includes(id)) ++horAct;
        });
        console.log('vertAct',vertAct,'horAct',horAct);
        console.log('vertAct+horAct',vertAct+horAct);
        console.log('activeIds.length',activeIds.length);

        let inequal = (vertAct+horAct > activeIds.length) ? true : false;
        console.log('inequal',inequal);

        if (vertAct>1 && horAct>1) {
          if (inequal || vertAct === horAct) {
            return console.log('error: cannot build in two directions!');
          }
        }
        else if (vertAct === horAct) {
          if (activeIds.length === 1) return true;
          activeIds.forEach((id,i) => {
            console.log('id',id,'activeIds[i+1]',activeIds[i+1]);
            let nextId = activeIds[i+1];
            if (!nextId) return console.log('vertMatch END');
            else if (id % 10 === nextId % 10) console.log('activeIds vertMatch',id % 10 === nextId % 10);
            else if (id + 1 === nextId) console.log('activeIds horMatch',id + 1 === nextId)
            else return console.log('FFFFF: cannot build in two directions!');
          });
        }
        else if (!inequal) return console.log('GGGGG: cannot build in two directions!');
        else return true;
      } 
      else return true;
    } // strictModeScoring() END 

    // check the tileSet of each foundWord, push the letter to tempWord, score the letter based on stack length
    let words=[],thisWord='',score=0;
    foundWords.forEach(tileSet => {
      if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
      let tempScore = 0;
      let tempWord = [];
        tileSet.forEach(tile => {
          // console.log('tile',tile);
          let activeIndex = activeIds.indexOf(tile.id);
          // console.log(activeIndex);
          if (activeIndex >= 0) activeIds.splice(activeIndex,1);
          tempWord.push(tile.stack[0]);
          return tempScore = tempScore + tile.stack.length;
        })
      thisWord = tempWord.join('').toLowerCase();
      if (this.dictionaryCheck(thisWord)) {
        score = score + tempScore;
        words.push(` + ( ${tempScore} ${tempWord.join('')} )`);
        tempScore = 0;
      } else {
        return score = 'fail';
      }
    });

    if (activeIds.length>0) return console.log('error: loose tiles');
    if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
    // console.log('score',score,words);
    this.setState(prevState => ({
      ...prevState,
      message: `you scored ${score} !`,
      myHistory: [...prevState.myHistory, words]
    }));
    return this.nextPlayer(score);
  }

  dictionaryCheck = (word) => {
    return true;
    // return (scrabbleWordList.includes(word)) ? true : false;
  }

  findWords = (sortedTiles) => {
    const newBoard = [...this.state.gameBoard];
    const tempWords = [];
    sortedTiles.forEach(tile => tempWords.push(...lookBothWays(tile)));
    let foundWords = uniqWords(tempWords);
    // console.log(foundWords.length,'uniqWords',foundWords);
    if (foundWords.length>0) return this.scoreWords(foundWords);

    function uniqWords(tileIds) {
      const seen = {};
      const result = tileIds.filter(tile => {
        let word = JSON.stringify(tile);
        return seen.hasOwnProperty(word) ? false : (seen[word] = true);
      });
      return result;
    }

    function lookBothWays(startTile) {
      const result = [];
      const {id} = startTile;
      let tempWord = [];
      // find VERTICAL word
      let vertWord = [];
      let above = (id < 20) ? null : startLook('above', startTile);
      if (above) vertWord.push(...above);
      let below = (id > 79) ? null : startLook('below', startTile);
      if (below) vertWord.push(...below);
      vertWord = [startTile,...vertWord].sort((a,b) => a.id-b.id);
      // find HORIZONTAL word
      let horWord = [];
      let left = (id % 10 === 0) ? null : startLook('left', startTile);
      if (left) horWord.push(...left);
      let right = (id-7 % 10 === 0) ? null : startLook('right', startTile);
      if (right) horWord.push(...right);
      horWord = [startTile,...horWord].sort((a,b) => a.id-b.id);
      if (vertWord.length>1) result.push(vertWord);
      if (horWord.length>1) result.push(horWord);
      // console.log('vertWord',vertWord);
      // console.log('horWord',horWord);
      // if (vertWord && horWord) console.log('error: must build in one direction only!')
      return result;

      function startLook(direction,startTile) {
        let next,offset;
        if (direction === 'above') offset = -10;
        if (direction === 'below') offset = 10;
        if (direction === 'left') offset = -1;
        if (direction === 'right') offset = 1;
        next = newBoard.find(tile => tile.id === startTile.id+offset);
        if (next && next.stack.length>0) {
          tempWord.push(next);
          return startLook(direction, next);
        } else if (tempWord.length>0) {
          const result = tempWord.sort((a,b) => a.id-b.id);
          tempWord=[];
          return result;
        } else return null;
      } // startLook() END
    } // lookBothWays() END
  } // findWords() END
} // App COMPONENT END
