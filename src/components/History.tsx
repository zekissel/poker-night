
interface HistoryProps {
    log: string[];
}

function History ({ log }: HistoryProps) {

    return (
        <div id='history'>
            <h2>Recent Moves</h2>
            <ol id='log'>
                { log.map((e) => <li key={e}>{ e }</li>) }
            </ol>
        </div>
    )
}

export default History