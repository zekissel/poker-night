import './App.css'
import { Player, Blinds } from './typedef'
import Actions from './Actions'
import Players from './Players'
import History from './History'
import Table from './Table'
import React, { useState } from 'react';


const p_temp: Player[] = [
  {name: 'Alice', money: 1000, call: 0, fold: false, blind: Blinds.Small},
  {name: 'Bob', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {name: 'Chad', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {name: 'Dan', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {name: 'Etho', money: 1000, call: 0, fold: false, blind: Blinds.None},
];



function App() {

  const [name, setName] = useState('');
  const updateName = (e: any) => { setName(e.target.value) };
  const [players, setPlayers] = useState<Player[]>(p_temp);

  const [init, setInit] = useState(true);
  const enterSubmit = (e: React.KeyboardEvent) => { 
    if (e.key == 'Enter' && name !== '') {
      p_temp.unshift({ name: `${name}`, money: 1000, call: 0, fold: false, blind: Blinds.Big });
      setPlayers(p_temp);
      setInit(false);
    }
  }

  return (
    <main>
      <h1>Poker Night</h1>
      { init ? 
        <input type='text' placeholder='Nickname' onKeyDown={enterSubmit} onChange={updateName}></input>
      :
        <span id='game'>
          <span id='left'>
            <Players players={players}/>
            <History />
          </span>
          <Table />
          <Actions />
        </span>
      }
    </main>
  )
}

export default App
