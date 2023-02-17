
function compMove (index) {

    let bet = analyzeHand(index);
    if (bet > 5) compRaise(index, bet - 5);
    else if (bet > 2) compCall(index);
    else compFold(index);
}

function compRedemption (index) {
    let bet = analyzeHand(index);
    if (bet > 3) compCall(index);
    else compFold(index);
}


function analyzeHand (index) {

    if (dealPhase < 1) return;

    curHand = { c1: playerHands[index].c1, c2: playerHands[index].c2, 
                c3: flop1.innerText, c4: flop2.innerText, c5: flop3.innerText,
                c6: turn.innerText, c7: river.innerText };

    let multiplier = 0;

    /* potentially randomize and give range */

    let h1 = curHand.c1; let h2 = curHand.c2;
    
    if (getSuit(h1) == getSuit(h2)) {
        multiplier += 3;
    }
    if (getRank(h1) == getRank(h2)) {

        if (getRank(h1) > 8) multiplier += 7;
        else multiplier+= 5;
        
    } else {
        getRank(h1) > 8 ? multiplier += 3 : multiplier += 1;
        getRank(h2) > 8 ? multiplier += 2 : multiplier += 1;
    }

    if (dealPhase < 2) return multiplier;
    let h3 = curHand.c3; let h4 = curHand.c4; let h5 = curHand.c5;

    
    return multiplier;

}

function compCall (index) {

    let dif = minCall - players[index].call;
    if (dif > 0) {
        let moneyGUI = playersGUI[index].getElementsByClassName('moneyCount');

        if (dif <= players[index].money) {
            /* update comp money and GUI */
            players[index].money -= dif;
            players[index].call += dif;
            
            moneyGUI[0].innerText = `$${players[index].money}`;

            /* update pot and game states */
            curPot += dif;
            

        } else {
            players[index].call += players[index].money;
            curPot += players[index].money;
            players[index].money = 0;
            
            moneyGUI[0].innerText = `$${players[index].money}`;

        }
        potGUI.innerText = `Current Pot - $${curPot}`;
    } else compFold(index);
}

function compRaise (index, value) {
    let bet = (value * 10) + (minCall - players[index].call);

    if (players[index].money >= bet) {
        let moneyGUI = playersGUI[index].getElementsByClassName('moneyCount');

        players[index].money -= bet;
        players[index].call += bet;
        
        moneyGUI[0].innerText = `$${players[index].money}`;

        /* update pot and game states */
        curPot += bet;
        potGUI.innerText = `Current Pot - $${curPot}`;
        minCall += value * 10;

    } else {
        compCall(index);
    }
}

function compFold (index) {
    players[index].fold = true;
}

/* map string to rank value */
function getRank (card) {
    let rank = card.slice(0, 1);
    switch (rank) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        default: return rank;
    }
}

/* extract suit from card -> RS (rank-suit) */
function getSuit (card) {
    return card.slice(1);
}