import 'App.css'
import { Player, Blinds } from './typedef'
import Actions from './components/Actions'
import Players from './components/Players'
import History from './components/History'
import Table from './components/Table'
import React, { useState } from 'react';
import Hand from './components/Hand'


const p_temp: Player[] = [
  {id: 1, name: 'Alice', money: 1000, call: 0, fold: false, blind: Blinds.Small},
  {id: 2, name: 'Bob', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {id: 3, name: 'Chad', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {id: 4, name: 'Dan', money: 1000, call: 0, fold: false, blind: Blinds.None},
  {id: 5, name: 'Etho', money: 1000, call: 0, fold: false, blind: Blinds.None},
];



function App() {

  const [name, setName] = useState('');
  const updateName = (e: any) => { setName(e.target.value) };
  const [players, setPlayers] = useState<Player[]>(p_temp);

  const [init, setInit] = useState(true);
  const enterSubmit = (e: React.KeyboardEvent) => { 
    if (e.key == 'Enter' && name !== '') {
      p_temp.unshift({ id: 0, name: `${name}`, money: 1000, call: 0, fold: false, blind: Blinds.Big });
      setPlayers(p_temp);
      setInit(false);
    }
  }

  const [log, setLog] = useState<string[]>([]);

  return (
    <main>
      <h1>Poker Night</h1>
      { init ? 
        <input type='text' placeholder='Nickname' onKeyDown={enterSubmit} onChange={updateName}></input>
      :
        <span id='game'>
          <span id='left-panel'>
            <Players players={players}/>
            <Hand info={players[0]}/>
          </span>
          <Table />
          <span id='right-panel'>
            <Actions />
            <History log={log}/>
          </span>
        </span>
      }
    </main>
  )
}

export default App
