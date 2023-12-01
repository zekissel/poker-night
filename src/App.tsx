import './App.css'
import { Player, Blinds } from './typedef'
import Actions from './components/Actions'
import Players from './components/Players'
import History from './components/History'
import Table from './components/Table'
import React, { useState } from 'react';
import Hand from './components/Hand'
import gameManager from './game'


const p_temp: Player[] = [
  {id: 1, name: 'Alice', money: 1000, call: 0, fold: false, blind: Blinds.Small, card1: undefined, card2: undefined},
  {id: 2, name: 'Bob', money: 1000, call: 0, fold: false, blind: Blinds.Big, card1: undefined, card2: undefined},
  {id: 3, name: 'Chad', money: 1000, call: 0, fold: false, blind: Blinds.None, card1: undefined, card2: undefined},
  {id: 4, name: 'Dan', money: 1000, call: 0, fold: false, blind: Blinds.None, card1: undefined, card2: undefined},
  {id: 5, name: 'Etho', money: 1000, call: 0, fold: false, blind: Blinds.None, card1: undefined, card2: undefined},
];



function App() {

  const [name, setName] = useState('');
  const updateName = (e: any) => { setName(e.target.value) };
  const [players, setPlayers] = useState<Player[]>(p_temp);

  const [init, setInit] = useState(true);
  const enterSubmit = (e: React.KeyboardEvent) => { 
    if (e.key == 'Enter' && name !== '') {
      p_temp.unshift({ id: 0, name: `${name}`, money: 1000, call: 0, fold: false, blind: Blinds.Dealer, card1: undefined, card2: undefined });
      setPlayers(p_temp);
      setInit(false);
      gameManager(log, setLog, players, setPlayers, pot, setPot, min, setMin);
    }
  }

  const [pot, setPot] = useState(0);
  const [min, setMin] = useState(0);

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
            <Hand info={players}/>
          </span>
          <Table pot={pot} min={min} />
          <span id='right-panel'>
            <Actions minBet={min} info={players} />
            <History log={log}/>
          </span>
        </span>
      }
    </main>
  )
}

export default App
