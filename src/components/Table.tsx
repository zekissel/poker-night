import { Card, Player } from "../typedef";
import CardImg from "./Card";

interface TableProps {
    pot: number;
    min: number;
    info: Player[];
    community: Card[];
}

function Table({ pot, min, info, community }: TableProps) {

    return (
        <div id='pokerTable'>
            <div id='communityPot'>
                <div id="jackpot">Current Pot: $<span id="curpot">{ pot }</span></div>
                <div id="minimum">Minimum call: $<span id="mincal">{ min }</span></div>
            </div>
            <div id='communityCards'>
                <div id="cc1" className='card'><CardImg card={community[0]} /></div>
                <div id="cc2" className='card'><CardImg card={community[1]} /></div>
                <div id="cc3" className='card'><CardImg card={community[2]} /></div>
                <div id="cc4" className='card'><CardImg card={community[3]} /></div>
                <div id="cc5" className='card'><CardImg card={community[4]} /></div>
            </div>

            <hr/>
            
            <div id='myHand'>
                <div id='myCards'>
                    <div id='mc1' className='card'><CardImg card={info[0].card1} /></div>
                    <div id='mc2' className='card'><CardImg card={info[0].card2} /></div>
                </div>
            </div>
        </div>
    )
}

export default Table