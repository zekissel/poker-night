import { useState } from "react";
import { Player } from "../typedef";

interface ActionProps {
    minBet: number;
    info: Player[];
}

function Actions({ minBet, info }: ActionProps) {

    const [bet, setBet] = useState(0);
    const updateBet = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const newBet = Number(e.currentTarget.value);
        if (newBet >= 0 && newBet <= info[0].money) setBet(newBet);
    }

    return (
        <div id='actions'>
            <h2>Actions</h2>
            <menu>
                <li>
                    <button id='submit'>{ bet > minBet ? ( bet === info[0].money ? 'All In' : 'Raise') : (minBet > 0 ? 'Call': 'Check') }</button>
                    $<input id='curCall' type='number' value={bet} onChange={updateBet}/>
                </li>

                <li><input id='slider' type='range' min={minBet} max={info[0].money} value={bet} onChange={updateBet} /></li>

                <li><button>Fold</button></li>
                <li><button>Skip</button></li>
            </menu>
        </div>
    )
}

export default Actions