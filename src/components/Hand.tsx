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
                    { info[0].blind === 1 && 'Dealer' }
                    { info[0].blind === 2 && 'Small Blind' }
                    { info[0].blind === 3 && 'Big Blind' }
                </div>
            </div>
        </div>
    )
}

export default Hand