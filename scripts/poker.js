
let curPot = 0;
const potGUI = document.getElementById('pot');
const callGUI = document.getElementById('call');
const historyGUI = document.getElementById('history');
let alt = false;

const numPlayers = 6;
let bigBlind = 20;
let curDealer = 0;
let curMove = (curDealer + 3) % numPlayers;
let minCall = 0;
let newround = false;

const startMoney = 1000;

const players = [ { name: 'P1', money: startMoney, role: 'D', call: 0, fold: false },
                  { name: 'Ari', money: startMoney, role: 'SB', call: 0, fold: false },
                  { name: 'Bill', money: startMoney, role: 'BB', call: 0, fold: false }, 
                  { name: 'Chris', money: startMoney, role: '', call: 0, fold: false },
                  { name: 'Denny', money: startMoney, role: '', call: 0, fold: false },
                  { name: 'Etho', money: startMoney, role: '', call: 0, fold: false } ];

const rawPlayersGUI = document.getElementsByClassName('players');
const playersGUI = Array.from(rawPlayersGUI);
const myGUI = document.getElementById('mydash');
playersGUI.unshift(myGUI);


function updateHistory (index, value, msg) {

    let newitem = document.createElement("li");
    if (alt) newitem.style.backgroundColor = '#596069';
    alt = !alt;

    if (msg != undefined) {
        newitem.appendChild(document.createTextNode(msg));
        historyGUI.prepend(newitem);
        return;
    }
    
    if (!isNaN(value)) {
        if (value > 0) {
            newitem.appendChild(document.createTextNode(`${players[index].name} raised by $${value}.`));
        } else [
            newitem.appendChild(document.createTextNode(`${players[index].name} called ($${minCall}).`))
        ]
    } else {
        newitem.appendChild(document.createTextNode(`${players[index].name} folded.`));
    }
    historyGUI.prepend(newitem);
}

/* rotates Dealer, Small Blind, and Big Blind buttons when a hand is finished */
function rotateButton () {

    let dealer = (curDealer + 1) % numPlayers;
    while (players[dealer].fold) dealer = (dealer + 1) % numPlayers;

    for (let p of players) {
        p.role = '';
    }

    players[dealer].role = 'D';
    curDealer = dealer;
    curMove = (dealer + 3) % numPlayers;
    while (players[curMove].fold) curMove = (curMove + 1) % numPlayers;

    let sb = (dealer + 1) % numPlayers;
    while (players[sb].fold) sb = (sb + 1) % numPlayers;
    players[sb].role = 'SB';

    let bb = (sb + 1) % numPlayers;
    while (players[bb].fold) bb = (bb + 1) % numPlayers;
    players[bb].role = 'BB';

    /* update GUI */
    for (let index = 0; index < numPlayers; index++) {
        let blind = playersGUI[index].getElementsByClassName('blind');
        blind[0].innerText = players[index].role;
    }
}

function blind () {
    let sb = 0; let bb = 0;
    while (players[sb].role != 'SB') sb = (sb + 1) % numPlayers;
    while (players[bb].role != 'BB') bb = (bb + 1) % numPlayers;

    if (players[sb].money > bigBlind / 2) {
        players[sb].call = bigBlind / 2;
        players[sb].money -= (bigBlind / 2);
    } else {
        players[sb].call = players[sb].money;
        players[sb].money = 0;
    }

    if (players[bb].money > bigBlind) {
        players[bb].call = bigBlind;
        players[bb].money -= bigBlind;
    } else {
        players[bb].call = players[sb].money;
        players[bb].money = 0;
    }

    /* set GUI */
    let sbMoney = playersGUI[sb].getElementsByClassName('moneyCount');
    sbMoney[0].innerText = `$${players[sb].money}`;
    let bbMoney = playersGUI[bb].getElementsByClassName('moneyCount');
    bbMoney[0].innerText = `$${players[bb].money}`;

    curPot += players[sb].call + players[bb].call;
    potGUI.innerText = `Current Pot: $${curPot}`;

    minCall = bigBlind;
    callGUI.innerText = `Current minimum call: $${minCall}`;
    
}

async function bettingRound (pass) {

    if (pass) {

        while (curMove != (curDealer + 3) % numPlayers) {
            if (!players[curMove].fold && curMove != 0) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compMove(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }

        secondBet();

    } else {

        while (curMove != 0) {
            if (!players[curMove].fold && curMove != 0) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compMove(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }
        curMove++;
        if (!players[0].fold) playerMove();
        else bettingRound(true);
    }

}

async function secondBet (pass) {

    newround = true;
    if (pass) {
        newround = false;

        while (curMove != (curDealer + 3) % numPlayers) {
            if (!players[curMove].fold && players[curMove].call < minCall && curMove != 0) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compRedemption(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }

        resetBets();

    } else {
        while (curMove != 0) {
            if (!players[curMove].fold && players[curMove].call < minCall && curMove != 0) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compRedemption(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }
        curMove++;
        if (!players[0].fold && players[0].call < minCall) playerRedemption();
        else secondBet(true);
    }
}

function resetBets () {

    for (let i = 0; i < numPlayers; i++) players[i].call = 0;
    minCall = 0;
    callGUI.innerText = `Current minimum call: $${minCall}`;
    newround = false;
    gameManager();
}



const popUp = document.createElement('div');
const prompt = document.createTextNode(`Press 'Deal' to Begin the Next Turn`);
const confirm = document.createElement('button');
const accept = document.createElement('button');
accept.innerText = 'Continue';
accept.style.width = '50%';
accept.style.padding = '2%';
accept.style.margin = '1%';
accept.style.fontSize = '120%';
confirm.innerText = 'Deal';
confirm.style.width = '50%';
confirm.style.padding = '2%';
confirm.style.margin = '1%';
confirm.style.fontSize = '120%';
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
popUp.appendChild(confirm);


window.addEventListener("load", (e) => { 

    document.body.appendChild(popUp);

});

confirm.addEventListener('click', (e) => {

    popUp.removeChild(confirm);
    document.body.removeChild(popUp);
    gameManager();

});

accept.addEventListener('click', (e) => {
    popUp.removeChild(accept);
    document.body.removeChild(popUp);
    gameManager();
});

function gameManager () {

    // still have to handle if everyone folds, and players who are eliminated

    switch (dealPhase) {

        case 0:
            shuffleDeck();
            updateHistory(0,0,'Dealing players.');
            dealPlayers();
            blind();
            bettingRound();
            break;
        
        case 1:
            if (testFold() === false) {
                updateHistory(0,0,'Dealing flop.');
                dealFlop();
                bettingRound();
            } else updateWinner(testFold());
            break;
        case 2:
            if (testFold() === false) {
                updateHistory(0,0,'Dealing turn.');
                dealTurn();
                bettingRound();
            } else updateWinner(testFold());
            break;

        case 3:
            if (testFold() === false) {
                updateHistory(0,0,'Dealing river.');
                dealRiver();
                bettingRound();
            } else updateWinner(testFold());
            break;

        case 4:
            if (testFold() === false) {
            /* card reveal and round decider function */
                let winner = showdown();
                if (Array.isArray(winner) && winner.length > 1) {
                    splitWinner(winner);
                } else if (Array.isArray(winner) && winner.length == 1) {
                    updateWinner(winner[0]);
                } else {
                    updateWinner(winner);
                }
            } else updateWinner(testFold());
            break;

        case 5:

            resetDeal();
            rotateButton();
            for (let n = 0; n < 5; n++) {
                if (!players[n+1].fold) card_bg[n].style.backgroundColor = '#252627';
                else card_bg[n].style.backgroundColor = '#A20021';
            }
            
            prompt.nodeValue = `Press 'Deal' to Begin the Next Turn`;
            popUp.appendChild(confirm);
            document.body.appendChild(popUp);
            break;

    }
}

function updateWinner (windex) {

    let msg = `Pot of $${curPot} goes to ${players[windex].name}!`;
    players[windex].money += curPot;
    let moneyGUI = playersGUI[windex].getElementsByClassName('moneyCount');
    moneyGUI[0].innerText = `$${players[windex].money}`;

    curPot = 0;
    potGUI.innerText = `Current Pot: $${curPot}`;

    dealPhase = 5;
    prompt.nodeValue = msg;
    popUp.appendChild(accept);
    document.body.appendChild(popUp);
}

function splitWinner (arr) {

}


/* MOVE BUTTONS */
const checkButton = document.getElementById('check');
checkButton.disabled = true;
checkButton.addEventListener('click', (e) => {

    if (players[0].money == 0) endPlayerMove();

    let dif = minCall - players[0].call;
    if (players[0].money >= dif) {
        players[0].call += dif;
        players[0].money -= dif;

        let moneyGUI = playersGUI[0].getElementsByClassName('moneyCount');
        moneyGUI[0].innerText = `$${players[0].money}`;

        curPot += dif;
        potGUI.innerText = `Current Pot: $${curPot}`;
        updateHistory(0, 0);
        endPlayerMove();
    }
});

let raiseValue = 0;
const raiseButton = document.getElementById('raise');
raiseButton.disabled = true;
raiseButton.addEventListener('click', (e) => {
    raiseValue += minCall;
    if (players[0].money >= raiseValue) {
        players[0].call += raiseValue;
        players[0].money -= raiseValue;

        let moneyGUI = playersGUI[0].getElementsByClassName('moneyCount');
        moneyGUI[0].innerText = `$${players[0].money}`;

        curPot += raiseValue;
        minCall = raiseValue;
        potGUI.innerText = `Current Pot: $${curPot}`;
        callGUI.innerText = `Current minimum call: $${minCall}`;
        updateHistory(0, raiseValue);

        endPlayerMove();
    }
});

const betSlider = document.getElementById('slider');
betSlider.addEventListener('click', (e) => {

    let myMoney = players[0].money;
    let bet = Math.floor(myMoney * (e.target.value / 100) / 10) * 10;
    raiseValue = bet;

    if (bet == myMoney) raiseButton.value = `All In - $${bet}`;
    else raiseButton.value = `Raise - $${bet}`;
});

const foldButton = document.getElementById('fold');
foldButton.disabled = true;
foldButton.addEventListener('click', (e) => {
    updateHistory(0);
    players[0].fold = true;
    endPlayerMove();
});

const skipButton = document.getElementById('skip');
skipButton.addEventListener('click', (e) => {
    if (sleep_timer > 0) {
        sleep_timer = 0;
        skipButton.style.backgroundColor = '#596069';
    }
    else {
        sleep_timer = 500;
        skipButton.style.backgroundColor = '#252627';
    }
});

function playerMove (ret) {

    checkButton.disabled = false;
    raiseButton.disabled = false;
    foldButton.disabled = false;

    if (minCall > 0) checkButton.value = `Call: $${minCall}`;
    else checkButton.value = `Check`;

    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#3775D3';
    
    if (testFold() === 0) {
        endPlayerMove();
    }

}

function playerRedemption () {

    checkButton.disabled = false;
    foldButton.disabled = false;

    if (minCall > 0) checkButton.value = `Call: $${minCall}`;
    else checkButton.value = `Check`;

    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#3775D3';

    if (testFold() === 0) {
        endPlayerMove();
    }

}

function endPlayerMove () {
    checkButton.disabled = true;
    raiseButton.disabled = true;
    foldButton.disabled = true;
    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#7E8893';

    checkButton.value = `Check`;

    betSlider.value = 0;
    raiseValue = 0;
    raiseButton.value = `Raise - $0`;

    if (newround) secondBet(true);
    else bettingRound(true);
}