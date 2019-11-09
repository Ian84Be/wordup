import React, { useState } from 'react';

const Form = ({ onSubmit }) => {
  const [num, setNum] = useState([1]);
  const [newPlayers, setnewPlayers] = useState({
    'name 1': '',
    'name 2': '',
    'name 3': '',
    'name 4': ''
  });

  return (
    <section className="playerForm">
      <header>How Many Players?</header>
      <div className="numberButtons">
        <button
          className={num.length === 1 ? 'num active' : 'num'}
          onClick={() => setNum([1])}
        >
          1
        </button>
        <button
          className={num.length === 2 ? 'num active' : 'num'}
          onClick={() => setNum([1, 2])}
        >
          2
        </button>
        <button
          className={num.length === 3 ? 'num active' : 'num'}
          onClick={() => setNum([1, 2, 3])}
        >
          3
        </button>
        <button
          className={num.length === 4 ? 'num active' : 'num'}
          onClick={() => setNum([1, 2, 3, 4])}
        >
          4
        </button>
      </div>

      <form onSubmit={e => onSubmit(e, num, newPlayers)}>
        {num.map(num => {
          return (
            <div className="playerName" key={num}>
              <label htmlFor={`name ${num}`}>Player {num}</label>
              <input
                autoFocus={num === 1 ? true : false}
                required
                id={`name ${num}`}
                onChange={e =>
                  setnewPlayers({
                    ...newPlayers,
                    [`name ${num}`]: e.target.value
                  })
                }
                placeholder="name"
                type="text"
                value={newPlayers[`name ${num}`]}
              />
            </div>
          );
        })}
        <button className="start">Start Game</button>
      </form>
    </section>
  );
};

export default Form;
