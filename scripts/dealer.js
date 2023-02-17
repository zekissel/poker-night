/* initialize and fill deck */
let curCard = 0;
const cardDeck = [52];
for (let c = 0; c < 52; c++) {
    cardDeck[c] = getRank(c) + getSuit(c);
}

/* Phase 0: deal players, 1: deal flop, 2: deal turn, 3: deal river, 4: reset */
let dealPhase = 0;

const playerHands = [ {c1: '', c2: ''},
                      {c1: '', c2: ''}, 
                      {c1: '', c2: ''},
                      {c1: '', c2: ''},
                      {c1: '', c2: ''},
                      {c1: '', c2: ''} ];

const communityCards = { f1: '', f2: '', f3: '', t: '', r: '' };

const flop1 = document.getElementById('cc-f1');
const flop2 = document.getElementById('cc-f2');
const flop3 = document.getElementById('cc-f3');
const turn = document.getElementById('cc-turn');
const river = document.getElementById('cc-river');

const hand1 = document.getElementById('card1');
const hand2 = document.getElementById('card2');


function dealFlop () {

    flop1.innerText = cardDeck[curCard++];
    communityCards.f1 = flop1.innerText;
    flop2.innerText = cardDeck[curCard++];
    communityCards.f2 = flop2.innerText;
    flop3.innerText = cardDeck[curCard++];
    communityCards.f3 = flop3.innerText;
    dealPhase++;
}

function dealTurn () {
    turn.innerText = cardDeck[curCard++];
    communityCards.t = turn.innerText;
    dealPhase++;
}

function dealRiver () {
    river.innerText = cardDeck[curCard++];
    communityCards.r = river.innerText;
    dealPhase++;
}

/* deal all players two cards in a cyclic fashion, starting from left of dealer */
function dealPlayers () {
    for (let n = 1; n <= numPlayers; n++) {
        playerHands[(n + curDealer) % numPlayers].c1 = cardDeck[curCard++];
    }
    for (let n = 1; n <= numPlayers; n++) {
        playerHands[(n + curDealer) % numPlayers].c2 = cardDeck[curCard++];
    }

    /* update GUI */
    hand1.innerText = playerHands[0].c1;
    hand2.innerText = playerHands[0].c2;
    dealPhase++;
}

/* revoke player and community cards, reset phase */
function resetDeal () {
    for (let n = 0; n < numPlayers; n++) {
        playerHands[n].c1 = '';
    }
    for (let n = 0; n < numPlayers; n++) {
        playerHands[n].c2 = '';
    }
    hand1.innerText = '';
    hand2.innerText = '';
    dealPhase = 0;
}

/* randomize card order and reset draw count*/
function shuffleDeck () {
    for (let n = 0; n < 3; n++) {
        for (let x = 0; x < 52; x++) {
            let y = Math.floor(Math.random() * 52);
            let temp = cardDeck[y];
            cardDeck[y] = cardDeck[x];
            cardDeck[x] = temp;
        }
    }
    curCard = 0;
}


/* map index/52 to 13 different ranks */
function getRank (index) {
    switch (index % 13) {
        case 0: return 'A'; case 1: return '2'; case 2: return '3'; case 3: return '4';
        case 4: return '5'; case 5: return '6'; case 6: return '7'; case 7: return '8';
        case 8: return '9'; case 9: return '0'; case 10: return 'J'; case 11: return 'Q';
        case 12: return 'K'; default: return 'X';
    }
}

/* map 1/4 of deck to each suit */
function getSuit (index) {

    for (let i = 0; i < 4; i++) {
        index -= 13;
        if (index < 0) {
            if (i == 0) return 'C';
            if (i == 1) return 'D';
            if (i == 2) return 'H';
            if (i == 3) return 'S';
        }
    }
}