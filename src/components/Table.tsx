interface TableProps {
    pot: number;
    min: number;
}

function Table({ pot, min }: TableProps) {

    return (
        <div id='pokerTable'>
            <div id='communityPot'>
                <div id="jackpot">Current Pot: $<span id="curpot">{ pot }</span></div>
                <div id="minimum">Minimum call: $<span id="mincal">{ min }</span></div>
            </div>
            <div id='communityCards'>
                <div id="cc1" className='card'> </div>
                <div id="cc2" className='card'> </div>
                <div id="cc3" className='card'> </div>
                <div id="cc4" className='card'></div>
                <div id="cc5" className='card'></div>
            </div>

            <hr/>
            
            <div id='myHand'>
                <div id='myCards'>
                    <div id='mc1' className='card'></div>
                    <div id='mc2' className='card'></div>
                </div>
            </div>
        </div>
    )
}

export default Table