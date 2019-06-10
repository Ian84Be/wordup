
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
    const {myLetters,myScore, gameBoard} = this.state;
    return ( 
      <div className="container">
        <PlayerOne 
          myLetters={myLetters}
          myScore={myScore}
          onDragStart={this.onDragStart}
          submitLetters={this.submitLetters}
        />

        <GameBoard 
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

  boardClick = (e, index, isActive) => {
    e.preventDefault();
    if (!isActive) return;
    const newBoard = [...this.state.gameBoard];
    const thisTile = newBoard[index];
    const thisLetter = thisTile.stack.shift();
    // if (!thisLetter) return console.log('NO LETTERZ');
    thisTile.active = false;
    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      message: '',
      myLetters: [...this.state.myLetters, thisLetter]
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

  onDragStart = (e, index, isActive = false) => {
    // console.log('dragSTART index',index);
    if (typeof(index) !== 'number') return e.dataTransfer.setData("letter", index);
    else if (!isActive) return;
    else {
      const thisTile = this.state.gameBoard[index];
      e.dataTransfer.setData("incomingIndex", index);
      e.dataTransfer.setData("letter", thisTile.stack[0]);
    }
  }

  onDrop = (e, droppedOnIndex, isActive) => {
    if (isActive) return console.log('ZZZZZ: cannot replace active tile');
    const letter = e.dataTransfer.getData("letter");
    if (letter === '') return;
    const newBoard = [...this.state.gameBoard];
    const myNewLetters = [...this.state.myLetters];
    const droppedOnTile = newBoard[droppedOnIndex];
    if (droppedOnTile.stack[0] === letter) return console.log('error: cannot duplicate letter');
    const incomingIndex = e.dataTransfer.getData("incomingIndex");
    if (incomingIndex) {
      const incomingTile = newBoard[incomingIndex];
      incomingTile.stack.shift();
      droppedOnTile.stack.unshift(letter);
      incomingTile.active = false;
    } else {
      myNewLetters.splice(myNewLetters.indexOf(letter),1)
      droppedOnTile.stack.unshift(letter);
    }
    droppedOnTile.active = true;
    this.setState(prevState => ({
      ...prevState,
      gameBoard: newBoard,
      message: '',
      myLetters: myNewLetters
    }));
  }

  passTurn = () => {
    const activeTiles = this.state.gameBoard.filter(tile => tile.active);
    if (activeTiles.length>0) return this.setState(() => ({message: 'cannot pass with tiles in play'}));
    this.nextPlayer(0);
  }

  submitLetters = () => {
    const activeTiles = this.state.gameBoard.filter(tile => tile.active).sort((a,b) => a.id-b.id);
    if (activeTiles.length<1) return this.setState(() => ({message: 'you havent placed any tiles!'}));
    else this.findWords(activeTiles);
  }

  scoreWords = (foundWords) => {
    // TODO
    // double strict scoring >> lose turn if dictionary FAIL
    const activeTiles = this.state.gameBoard.filter(tile => tile.active).sort((a,b) => a.id-b.id);
    const activeIds = [];
    activeTiles.forEach(tile => activeIds.push(tile.id));
    let okStrict = strictModeScoring(foundWords);
    if (!okStrict) return console.log('error: strictModeScoring VIOLATION');
    // if (activeIds.length>0) return console.log('error: loose tiles');

    let score = this.calculateScore(foundWords);
    console.log(score);
    let words = 'BANANA';

    // if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
    // console.log('score',score,words);
    this.setState(prevState => ({
      ...prevState,
      message: `you scored ${score} !`,
      myHistory: [...prevState.myHistory, words]
    }));
    return this.nextPlayer(score);

    function strictModeScoring(foundWords) {
      // pull ids for vertWord && horWord
      let vertWay = [];
      let horWay = [];
      foundWords.forEach((tileSet, index) => {
        console.log('strictModeScoring tileSet',tileSet);
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
        // console.log('vertWord',vertWord,'horWord',horWord);
      });
      console.log('vertWay',vertWay,'horWay',horWay);
      console.log('activeIds',activeIds);

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
          if (inequal && vertAct === horAct) {
            let vertCheck = 0;
            let horCheck = 0;
            let errCheck = 0;
            activeIds.forEach((id,i) => {
              console.log('vertcheckhorcheck id',id);
              let nextId = activeIds[i+1];
              let lastId = activeIds[i-1];
              console.log('nextId',nextId);
              if (!nextId) {
                if (id % 10 === lastId % 10) ++vertCheck;
                if (id - 1 === lastId) ++horCheck;
              }
              else if (id % 10 === nextId % 10 || id % 10 === lastId % 10) ++vertCheck;
              else if (id + 1 === nextId || id - 1 === nextId) ++horCheck;
              else ++errCheck;
            });
            console.log('vertCheck',vertCheck,'horCheck',horCheck,'errCheck',errCheck);
            if (errCheck) return console.log('error: cannot build in two directions!');
            else if (vertCheck !== horCheck) {
              if (vertCheck === 0 || horCheck === 0) return true;
              else return console.log('error: cannot build in two directions!');
            }
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
        else if (inequal) return console.log('GGGGG: cannot build in two directions!');
        // else return true;
      } 
      else return true;
    } // strictModeScoring() END 

    // calculateScore()


  }
  
  calculateScore = (foundWords) => {
            // calculateScore() START
        // CALCULATE TILE VALUE && END TURN
        // check the tileSet of each foundWord, push the letter to tempWord, score the letter based on stack length
        let words=[],thisWord='',score=0;
        foundWords.forEach(tileSet => {
          if (score === 'fail') return this.setState(() => ({message: `dictionary fail ${thisWord.toUpperCase()}`}));
          let tempScore = 0;
          let tempWord = [];
            tileSet.forEach(tile => {
              console.log('valid scoring tile',tile);
              // let activeIndex = activeIds.indexOf(tile.id);
              // console.log(activeIndex);
              // if (activeIndex >= 0) activeIds.splice(activeIndex,1);
              // console.log('tile.active',tile.active);
              // tile.active = false;
              tile.active = 'banana';
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
        }); // calculateScore() END
  }

  dictionaryCheck = (word) => {
    return true;
    // return (scrabbleWordList.includes(word)) ? true : false;
  }

  findWords = (activeTiles) => {
    // console.log('findWords(activeTiles)',activeTiles);
    const newBoard = [...this.state.gameBoard];
    const tempWords = [];
    activeTiles.forEach(tile => tempWords.push(...lookBothWays(tile)));
    console.log('findWords tempWords',tempWords);
    let foundWords = uniqWords(tempWords);
    console.log(foundWords.length,'uniqWords',foundWords);
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
        let vertWord = [];
        // find VERTICAL word
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
        // if (vertWord.length>1 && horWord.length>1) console.log('error: must build in one direction only!')
        return result;

        function startLook(direction, startTile) {
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
