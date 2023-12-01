import { Card, Blinds, Player } from "./typedef";

function initDeck () {
    const deck: Card[] = [];
    for (let s = 0; s < 4; s++) {
        for (let r = 0; r < 13; r++) {
            deck.push({ rank: r, suit: s });
        }
    }
    return deck;
}

function shuffleDeck (deck: Card[]) {
    for (let h = 0; h < 3; h++) {
        for (let i = 0; i < 52; i++) {
            const ind = Math.floor(Math.random() * 52);
            const c: Card = deck[ind];
            deck[ind] = deck[i];
            deck[i] = c;
        }
    }
}

function gameManager (
    log: string[], 
    setLog: React.Dispatch<React.SetStateAction<string[]>>,
    players: Player[],
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
    pot: number,
    setPot: React.Dispatch<React.SetStateAction<number>>,
    min: number,
    setMin: React.Dispatch<React.SetStateAction<number>>,
    community: Card[],
    setCommunity: React.Dispatch<React.SetStateAction<Card[]>>,

) {

    const deck: Card[] = initDeck();
    let curCard = 0;
    shuffleDeck(deck);

    let active = true;
    let dealer = 0;
    let BLIND = 20;
    log = ['New game starting.']

    function betAndCheck () {
        
    }

    function resetAndRotate () {

    }

    //while (players.length > 1) {

        collectBlinds();
        dealPlayers();
        betAndCheck();
        dealFlop();
        betAndCheck();
        dealTurn();
        betAndCheck();
        dealRiver();
        betAndCheck();
        showdown();

        resetAndRotate();
    //}

    function collectBlinds () {
        log.unshift('Collecting big and small blinds.')
        setLog(log);
        const blinds = players.filter((p) => p.blind === Blinds.Small || p.blind === Blinds.Big)
        blinds.forEach((b) => {
            if (b.blind === Blinds.Small) b.money -= (BLIND / 2);
            else b.money -= BLIND;
        })
        setPot(BLIND * 1.5);
        setMin(BLIND);
    }

    function dealPlayers () {
        for (let d = 0; d < players.length; d++) {
            if (!players[(d + dealer + 1) % players.length].fold) {
                players[(d + dealer + 1) % players.length].card1 = deck[curCard++];
            }
        }

        for (let d = 0; d < players.length; d++) {
            if (!players[(d + dealer + 1) % players.length].fold) {
                players[(d + dealer + 1) % players.length].card2 = deck[curCard++];
            }
        }
        setPlayers(players);
        dealer += 1;
    }

    function dealFlop () {

    }

    function dealTurn () {
        
    }

    function dealRiver () {
        
    }

    function showdown () {
        
    }
}

export default gameManager