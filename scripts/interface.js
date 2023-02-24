/* sleep timer for bots */
let sleep_timer = 500;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* pot and call GUI on document */
const potGUI = document.getElementById('pot');
const callGUI = document.getElementById('call');

/* recent moves that alternate background color */
const historyGUI = document.getElementById('history');
let alt = false;

/* community cards GUI */
const flop1 = document.getElementById('cc-f1');
const flop2 = document.getElementById('cc-f2');
const flop3 = document.getElementById('cc-f3');
const turn = document.getElementById('cc-turn');
const river = document.getElementById('cc-river');
const comCardGUI = [flop1, flop2, flop3, turn, river];

/* private cards GUI */
const hand1 = document.getElementById('card1');
const hand2 = document.getElementById('card2');
const privCardGUI = [hand1, hand2];

/* used to declare class instances of GUI for each player */
const rawPlayersGUI = document.getElementsByClassName('players');
const playersGUI = Array.from(rawPlayersGUI);
const myGUI = document.getElementById('mydash');
playersGUI.unshift(myGUI);

/* colors to show active/eliminated player */
const color_active = `#3775D3`;
const color_inactive = `#252627`;
const color_elim = `#A20021`;
const color_grey = `#7E8893`;

/* style for pop up window */
const popUp = document.createElement('div');
const prompt = document.createTextNode(`Press 'Deal' to Begin the Next Turn`);
const accept = document.createElement('button');
accept.innerText = 'Deal';
accept.style.width = '50%';
accept.style.padding = '2%';
accept.style.margin = '1%';
accept.style.fontSize = '120%';
popUp.style.height = '10%';
popUp.style.width = '25%';
popUp.style.zIndex = '10';
popUp.style.margin = 'auto';
popUp.style.padding = '5%';
popUp.style.backgroundColor = '#1F2041';
popUp.style.opacity = '.9';
popUp.style.position = 'absolute';
popUp.style.bottom = '40%';
popUp.style.left = '32.5%';
popUp.style.textAlign = 'center';
popUp.style.fontSize = '150%';
popUp.appendChild(prompt);
popUp.appendChild(accept);


/* instantiate game */
const poker = new Game(6);
window.addEventListener("load", (e) => {
    
    document.body.appendChild(popUp);
});

/* continue to deal or to round reset */
accept.addEventListener('click', (e) => {
    
    document.body.removeChild(popUp);
    poker.manager();
});


/* add recent move to GUI */
function updateHistory (msg) {

    let newItem = document.createElement("li");
    if (alt) newItem.style.backgroundColor = '#596069';
    alt = !alt;

    newItem.appendChild(document.createTextNode(msg));
    historyGUI.prepend(newItem);
}


/* player check/call */
const checkButton = document.getElementById('check');
checkButton.addEventListener('click', (e) => {

    let me = poker.players[0];

    if (me.money == 0) {
        updateHistory(`${me.name} checked`);
        me.endMove();
        return;
    }

    let dif = poker.minCall - me.call;
    if (me.money >= dif) {
        me.call += dif;
        me.money -= dif;
    } else {
        dif = me.money;
        me.call += dif;
        me.money = 0;
    }

    me.moneyGUI.innerText = `$${me.money}`;

    poker.curPot += dif;
    potGUI.innerText = `Current Pot: $${poker.curPot}`;
    if (dif > 0) updateHistory(`${me.name} called $${dif}`);
    else updateHistory(`${me.name} checked`);
    me.endMove();
});

/* player raise */
let raiseValue = 0;
const raiseButton = document.getElementById('raise');
raiseButton.addEventListener('click', (e) => {
    let me = poker.players[0];

    raiseValue += poker.minCall;
    if (me.money >= raiseValue) {
        me.call += raiseValue;
        me.money -= raiseValue;

        me.moneyGUI.innerText = `$${me.money}`;
        updateHistory(`${me.name} raised $${raiseValue - poker.minCall} ($${raiseValue} total)`);

        poker.curPot += raiseValue;
        poker.minCall = raiseValue;
        potGUI.innerText = `Current Pot: $${poker.curPot}`;
        callGUI.innerText = `Current minimum call: $${poker.minCall}`;

        me.endMove();
    }
});

/* slider to adjust raise */
const betSlider = document.getElementById('slider');
betSlider.addEventListener('click', (e) => {

    let myMoney = poker.players[0].money;
    raiseValue = Math.floor(myMoney * (e.target.value / 100) / 10) * 10;

    if (raiseValue == myMoney) raiseButton.value = `All In - $${raiseValue}`;
    else raiseButton.value = `Raise - $${raiseValue}`;
});

/* player fold */
const foldButton = document.getElementById('fold');
foldButton.addEventListener('click', (e) => {
    poker.players[0].fold = true;
    updateHistory(`${poker.players[0].name} folded`);
    poker.players[0].endMove();
});

/* speed up bot moves */
const skipButton = document.getElementById('skip');
skipButton.addEventListener('click', (e) => {
    if (sleep_timer > 0) {
        sleep_timer = 0;
        skipButton.style.backgroundColor = '#596069';
    }
    else {
        sleep_timer = 500;
        skipButton.style.backgroundColor = `${color_inactive}`;
    }
});

/* return array of scores and highcards */
function showdown(playerArr, comCards) {

    let hands = [];

    for (let n = 0; n < playerArr.length; n++) {
        if (playerArr[n].fold) hands.push([false]);
        else {
            hands.push( [ playerArr[n].card1, playerArr[n].card2, 
                         comCards[0], comCards[1], comCards[2], 
                         comCards[3], comCards[4] ] );
            updateHistory(`${playerArr[n].name}'s hand: ${playerArr[n].card1} & ${playerArr[n].card2}`);
        }
    }

    let scores = [];
    /* score hands with format [[hand rank straight flush (1) - high card (9), relavent highcard, highcard 2], player index] */
    for (let h = 0; h < hands.length; h++) if (hands[h][0] !== false) {
        scores.push(scoreHands(hands[h], h));
    }
    
    for (let s of scores) console.log(`${poker.players[s[1]].name}: ${s[0][0]}, HC's: ${s[0][1]}, ${s[0][2]}`);
    console.log(``);
    
    let windex = [];
    let winscore = 10;
    for (let s of scores) {
        if (s[0][0] < winscore) {
            winscore = s[0][0];
            windex = [];
            windex.push(s[1]);
        } else if (s[0][0] == winscore) windex.push(s[1]);
    }
    if (windex.length == 1) return windex[0];

    /* settle tie by first high card */
    let tie = 0;
    for (let s of scores) {
        if (s[0][0] == winscore) {
            if (s[0][1] > tie) {
                tie = s[0][1];
                windex = [];
                windex.push(s[1]);
            } else if (s[0][1] == tie) windex.push(s[1]);
        }
    }
    if (windex.length == 1) return windex[0];

    tie = 0;
    for (let s of scores) {
        if (s[0][0] == winscore) {
            if (s[0][2] > tie) {
                tie = s[0][2];
                windex = [];
                windex.push(s[1]);
            } else if (s[0][2] == tie) windex.push(s[1]);
        }
    }
    if (windex.length == 1) return windex[0];
    return windex;
}

function scoreHands (hand, index) {

    let suits = { C: 0, D: 0, H: 0, S: 0 };
    let ranks = { A: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, T: 0, J: 0, Q: 0, K: 0 };
    let myCards = [toNum(hand[0].slice(0,1)), toNum(hand[1].slice(0,1))].sort( (a,b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        else return 0;
    });

    /* populate suits and ranks objects */
    for (let c in hand) {
        suits[hand[c].slice(1)]++;
        ranks[hand[c].slice(0,1)]++;
    }

    let flush = false;
    for (let s in suits) {
        if (suits[s] == 5) {
            flush = true;
            for (let c in hand) {
                /* make sure 6th and 7th cards cannot contribute to straight or high cards */
                if (suits[hand[c].slice(1)] != s) {
                    ranks[hand[c].slice(0,1)]--;
                }
            }
        }
    }

    let threecard = [];
    let pairs = [];
    for (let r in ranks) {
        if (ranks[r] > 0) {
            /* test for four/three of a kind and pairs */
            if (ranks[r] == 4 && !isNaN(r)) return [[2, Number(r), myCards[0]], index];
            else if (ranks[r] == 4 && isNaN(r)) return [[2, toNum(r), myCards[0]], index];

            if (ranks[r] == 3 && !isNaN(r)) threecard.push(Number(r));
            else if (ranks[r] == 3 && isNaN(r)) threecard.push(toNum(r));

            if (ranks[r] == 2 && !isNaN(r)) pairs.push(Number(r));
            else if (ranks[r] == 2 && isNaN(r)) pairs.push(toNum(r));
        }
    }
    /* full house better than flush, no chance for straight */
    if (threecard.length > 0 && pairs.length > 0) return [[3, Math.max(threecard), Math.max(pairs)], index];

    let straight = testStraight(ranks);

    /* return straights, flushes, and straight flushes */
    if (straight !== false) {
        if (flush) straight[0] = 1;
        return [straight, index];
    }
    if (flush) return [[4, myCards[0], myCards[1]], index];

    if (threecard.length > 0) return [[6, Math.max(threecard), myCards[0] == Math.max(threecard) ? myCards[1] : myCards[0]], index];
    if (pairs.length > 1) return [[7, myCards[0], myCards[1]], index];
    if (pairs.length > 0) return [[8, Math.max(pairs), myCards[0] == Math.max(pairs) ? myCards[1] : myCards[0]], index];
    return [[9, myCards[0], myCards[1]], index];
}

function testStraight (ranks) {
    let run = 0;
    for (let i = 15; i > 0; i--) {
        let c;
        if (i == 1 || i == 10 || i == 11 || i == 12 || i == 13 || i == 14) {
            switch (i) {
                case 10: c = 'T'; break;
                case 11: c = 'J'; break;
                case 12: c = 'Q'; break;
                case 13: c = 'K'; break;
                default: c = 'A';
            }
        } else c == i;

        run = ranks[c] > 0 ? run + 1 : 0;
        if (run == 5) return [5, c + 4, 0];
    }
    return false;
}

function toNum (rank) {
    switch (rank) {
        case 'A': return Number(14);
        case 'K': return Number(13);
        case 'Q': return Number(12);
        case 'J': return Number(11);
        case 'T': return Number(10);
        default: return Number(rank);
    }
}