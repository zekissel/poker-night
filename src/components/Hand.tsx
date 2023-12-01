import { Player } from "../typedef"

interface HandProps {
    info: Player[];
}

function Hand ({ info }: HandProps) {


    return (
        <div id='hand'>
            <h2>Chips</h2>
            <div id='myChips'>
                <div id='myMoney'>
                    $ <span id='moneyNumber'>{ info[0].money }</span>
                </div>
                <div id='myBlind'>
                    { info[0].blind }
                </div>
            </div>
        </div>
    )
}

export default Hand