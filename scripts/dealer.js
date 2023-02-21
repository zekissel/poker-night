/* initialize and fill deck */
let curCard = 0;
const cardDeck = [52];
for (let c = 0; c < 52; c++) {
    cardDeck[c] = getRank(c) + getSuit(c);
}

/* Phase 0: deal players, 1: deal flop, 2: deal turn, 3: deal river, 4: showdown, 5: reset */
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
        if (players[n].money > 0) players[n].fold = false;
        else players[n].fold = true;
    }
    for (let n = 0; n < numPlayers; n++) {
        playerHands[n].c2 = '';
    }
    communityCards.f1 = ''; communityCards.f2 = ''; communityCards.f3 = '';
    communityCards.t = ''; communityCards.r = '';
    flop1.innerText = ''; flop2.innerText = ''; flop3.innerText = '';
    turn.innerText = ''; river.innerText = ''; 
    hand1.innerText = '';
    hand2.innerText = '';
    dealPhase = 0;
}




function showdown () {

    let finalists = [];

    for (let p = 0; p < numPlayers; p++) {
        if (!players[p].fold) {
            let p_hand = new Object();
            p_hand.c1 = playerHands[p].c1;
            p_hand.c2 = playerHands[p].c2;
            p_hand.c3 = communityCards.f1;
            p_hand.c4 = communityCards.f2;
            p_hand.c5 = communityCards.f3;
            p_hand.c6 = communityCards.t;
            p_hand.c7 = communityCards.r;
            finalists.push(p_hand);
        }
    }

    let scores = [];

    for (let f of finalists) {

        let score = scoreHand(f);
        scores.push(score);
        
        
    }
    
    let winner = 10;
    let tie_break = false;
    for (let s of scores) {
        if (s < winner) {
            winner = s;
            tie_break = false;
        }
        else if (s == winner) tie_break = true;
    }
    if (tie_break) {
        // implement tiebreak
    }
    // change this to possibly split pot
    windex = 0;
    while (scores[windex] != winner) {
        windex++;
    }
    
    console.log(finalists);
    console.log(scores);

    let notfolded = 0;
    for (let i = 0; i < numPlayers; i++) {
        if (!players[i].fold) {
            notfolded++;
            if (notfolded - 1 == windex) {
                windex = i;
            }
        }
    }

    players[windex].money += curPot;
    let moneyGUI = playersGUI[windex].getElementsByClassName('moneyCount');
    moneyGUI[0].innerText = `$${players[windex].money}`;

    curPot = 0;
    potGUI.innerText = `Current Pot - $${curPot}`;

    dealPhase = 5;
    return windex;

}

function scoreHand (hand) {

    let suits = { C: 0, D: 0, H: 0, S: 0 };
    let ranks = { A: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 0: 0, J: 0, Q: 0, K: 0 };
    let fouroak = false;
    let flush = false;
    let straight = false;
    let threeoak = false;
    let pairs = 0;

    for (let c in hand) {          // populate suits and ranks objects
        suits[hand[c].slice(1)]++;
        ranks[hand[c].slice(0,1)]++;
    }

    for (let r in ranks) {

        if (ranks[r] == 4) {
            fouroak = true;
        }
        if (ranks[r] == 3) threeoak = true;
        if (ranks[r] == 2) pairs++;
    }

    for (let s in suits) {
        if (suits[s] > 4) {
            flush = true;
            for (let c in hand) {
                if (suits[hand[c].slice(1)] != s) {
                    ranks[hand[c].slice(0,1)]--;
                }
            }
        }
    }

    straight = testStraight(ranks);

    if (straight & flush) return 1;
    if (fouroak) return 2;
    if (threeoak && pairs > 0) return 3;
    if (flush) return 4;
    if (straight) return 5;
    if (threeoak) return 6;
    if (pairs > 1) return 7;
    if (pairs > 0) return 8;
    else return 9;

}

function testStraight (ranks) {

    let ace = ranks.A > 0;
    let king = ranks.K > 0;
    let queen = ranks.Q > 0;
    let jack = ranks.J > 0;

    let run = ace ? 1 : 0;
    for (let i = 2; i != 1; i = ((i + 1) % 10)) {
        if (ranks[i] > 0) {
            run++;
            if (run == 5) return true;
        } else {
            run = 0;
        }
    }
    if (jack) {
        if (run == 4) return true;
        else if (queen) {
            if (run == 3) return true;
            else if (king) {
                if (run == 2) return true;
                else if (ace) {
                    if (run == 1) return true;
                }
            }
        }
    }
    
    return false;

}

function findHighCard (hands, scores, winscore) {

    let tiebreak = [];

    for (let i = 0; i < scores.length; i++) {
        if (scores[i] == winscore) {
            let suits = { C: 0, D: 0, H: 0, S: 0 };
            let ranks = { A: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 0: 0, J: 0, Q: 0, K: 0 };
            for (let c in hands[i]) {
                suits[hand[c].slice(1)]++;
                ranks[hand[c].slice(0,1)]++;
            }
            switch (winscore) {
                case 1:
                case 5: 
                // straight flush and straight
                    tiebreak.push(getStraightHC(ranks));
                    break;
                case 2:
                    // four of a kind
                    for (let r in ranks) {
                        if (ranks[r] == 4 && !isNaN(r) && r != 0) tiebreak.push(r);
                        else if (ranks[r] == 4 && !isNaN(r) && r == 0) tiebreak.push(10);
                        else if (ranks[r] == 4) tiebreak.push(toNum(r)); 
                    }
                    break;
                case 3:
                    // full house

                    break;
                case 4:
                    // flush
                    break;
                case 6:
                    // three of a kind
                    break;
                case 7:
                    // two pair
                    break;
                case 8:
                    // one pair
                    break;
                case 9:
                    //high card
                    break;
            }
        }
    }
}

function getStraightHC (ranks) {

    let ace = ranks.A > 0; let king = ranks.K > 0; let queen = ranks.Q > 0;
    let jack = ranks.J > 0; let ten = ranks[0] > 0; let nine = ranks[9] > 0;
    let eight = ranks[8] > 0; let seven = ranks[7] > 0; let six = ranks[6] > 0;
    let five = ranks[5] > 0; let four = ranks[4] > 0; let three = ranks[3] > 0;
    let two = ranks[2] > 0;
    
    if (ace && king && queen && jack&& ten) return 14;
    else if (king && queen && jack && ten && nine) return 13;
    else if (queen && jack && ten && nine && eight) return 12;
    else if (jack && ten && nine && eight && seven) return 11;
    else if (ten && nine && eight && seven && six) return 10;
    else if (nine && eight && seven && six && five) return 9;
    else if (eight && seven && six && five && four) return 8;
    else if (seven && six && five && four && three) return 7;
    else if (six && five && four && three && two) return 6;
    else return 5;
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

function toNum (rank) {
    switch (rank) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        default: return 0;
    }
}