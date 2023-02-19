
let curPot = 0;
const potGUI = document.getElementById('pot');

const numPlayers = 6;
let bigBlind = 20;
let curDealer = 0;
let curMove = (curDealer + 3) % numPlayers;
let minCall = 0;
let newround = false;

const sleep_timer = 500;

const players = [ { name: 'P1', money: 500, role: 'D', call: 0, fold: false },
                  { name: 'Alice', money: 500, role: 'SB', call: 0, fold: false },
                  { name: 'Bill', money: 500, role: 'BB', call: 0, fold: false }, 
                  { name: 'Chauncy', money: 500, role: '', call: 0, fold: false },
                  { name: 'Denise', money: 500, role: '', call: 0, fold: false },
                  { name: 'Etho', money: 500, role: '', call: 0, fold: false } ];

const rawPlayersGUI = document.getElementsByClassName('players');
const playersGUI = Array.from(rawPlayersGUI);
const myGUI = document.getElementById('mydash');
playersGUI.unshift(myGUI);

/* rotates Dealer, Small Blind, and Big Blind buttons when a hand is finished */
function rotateButton () {
    let temp = players[0].role;
    let temp2;
    /* cycle button positions */
    for (let b = 1; b < numPlayers + 1; b++) {
        temp2 = players[b % numPlayers].role;
        players[b % numPlayers].role = temp;
        temp = temp2;
    }

    /* update GUI */
    for (let i = 0; i < 4; i++) {
        index = (curDealer + i) % numPlayers;
        let blind = playersGUI[index].getElementsByClassName('blind');
        blind[0].innerText = players[index].role;
    }
    /* cycle index of dealer button */
    curDealer = (curDealer + 1) % numPlayers;
    curMove = (curDealer + 3) % numPlayers;
}

function blind () {
    let sb = (curDealer + 1) % numPlayers;
    let bb = (curDealer + 2) % numPlayers;

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
    potGUI.innerText = `Current Pot - $${curPot}`;

    minCall = bigBlind;
    
}

async function bettingRound (pass) {

    if (pass) {

        while (curMove != (curDealer + 3) % numPlayers) {
            if (!players[curMove].fold) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compMove(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }

        secondBet();

    } else {

        while (curMove != 0) {
            if (!players[curMove].fold) {
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
            if (!players[curMove].fold && players[curMove].call < minCall) {
                card_bg[curMove - 1].style.backgroundColor = '#3775D3';
                await sleep(sleep_timer);
                compRedemption(curMove);
            }
            curMove = (curMove + 1) % numPlayers;
        }

        resetBets();

    } else {
        while (curMove != 0) {
            if (!players[curMove].fold && players[curMove].call < minCall) {
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

});

function gameManager () {

    switch (dealPhase) {

        case 0:
            shuffleDeck();
            dealPlayers();
            blind();
            bettingRound();
            break;
        
        case 1:
            console.log(`dealing flop`);
            dealFlop();
            bettingRound();
            break;

        case 2:
            console.log(`dealing turn`);
            dealTurn();
            bettingRound();
            break;

        case 3:
            console.log(`dealing river`);
            dealRiver();
            bettingRound();
            break;

        case 4:
            /* card reveal and round decider function (add pot to winners money, update GUI) */
            showdown();
            dealPhase = 5;
            gameManager();
            break;
        case 5:
            console.log('deal reset');
            for (let n = 0; n < 5; n++) card_bg[n].style.backgroundColor = '#252627';
            resetDeal();
            rotateButton();
            gameManager();
            break;

    }
}


/* MOVE BUTTONS */
const checkButton = document.getElementById('check');
checkButton.disabled = true;
checkButton.addEventListener('click', (e) => {

    let dif = minCall - players[0].call;
    if (players[0].money >= dif) {
        players[0].call += dif;
        players[0].money -= dif;

        let moneyGUI = playersGUI[0].getElementsByClassName('moneyCount');
        moneyGUI[0].innerText = `$${players[0].money}`;

        curPot += dif;
        potGUI.innerText = `Current Pot - $${curPot}`;
        console.log(`I checked/called`);
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
        potGUI.innerText = `Current Pot - $${curPot}`;
        console.log('i raised');
        endPlayerMove();
    }
});

const betSlider = document.getElementById('slider');
betSlider.addEventListener('click', (e) => {

    let myMoney = players[0].money;
    let bet = Math.floor(myMoney * (e.target.value / 100));
    raiseValue = bet;

    if (bet == myMoney) raiseButton.value = `All In - $${bet}`;
    else raiseButton.value = `Raise - $${bet}`;
});

const foldButton = document.getElementById('fold');
foldButton.disabled = true;
foldButton.addEventListener('click', (e) => {
    console.log('test fold');
    players[0].fold = true;
    endPlayerMove();
});

const skipButton = document.getElementById('skip');
skipButton.addEventListener('click', (e) => {
    console.log('test skip');
});

function playerMove (ret) {

    checkButton.disabled = false;
    raiseButton.disabled = false;
    foldButton.disabled = false;

    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#3775D3';
    

    console.log(playerHands);
    console.log(players);

}

function playerRedemption () {

    checkButton.disabled = false;
    foldButton.disabled = false;

    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#3775D3';

}

function endPlayerMove () {
    checkButton.disabled = true;
    raiseButton.disabled = true;
    foldButton.disabled = true;
    const card_bg = document.getElementById('privateCards');
    card_bg.style.backgroundColor = '#7E8893';

    if (newround) secondBet(true);
    else bettingRound(true);
}