import { Player } from "../typedef";

interface PlayerProps {
    info: Player;
}
interface PlayersProps {
    players: Player[];
}

function Player({ info }: PlayerProps) {

    const chip = { backgroundColor: `#222` }
    return (
        <div className='player'>
            <span id='pName'>
                { info.name }
            </span>
            <span id='pBlind' style={info.blind > 0 ? chip : undefined}>
                { info.blind === 1 && 'D' }
                { info.blind === 2 && 'SB' }
                { info.blind === 3 && 'BB' }
            </span>
            <span id='pMoney'>
                ${ info.money }
            </span>
        </div>
    )
}


function Players({ players }: PlayersProps) {

    return (
        <div id='players'>
            <h2>Players</h2>
            { players.map((p) => p.id !== 0 && <Player key={p.name} info={p} />) }
        </div>
    )
}

export default Players