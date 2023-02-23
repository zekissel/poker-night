let sleep_timer = 500;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const potGUI = document.getElementById('pot');
const callGUI = document.getElementById('call');

const historyGUI = document.getElementById('history');
let alt = false;

const flop1 = document.getElementById('cc-f1');
const flop2 = document.getElementById('cc-f2');
const flop3 = document.getElementById('cc-f3');
const turn = document.getElementById('cc-turn');
const river = document.getElementById('cc-river');
const comCardGUI = [flop1, flop2, flop3, turn, river];

const hand1 = document.getElementById('card1');
const hand2 = document.getElementById('card2');
const privCardGUI = [hand1, hand2];

const rawPlayersGUI = document.getElementsByClassName('players');
const playersGUI = Array.from(rawPlayersGUI);
const myGUI = document.getElementById('mydash');
playersGUI.unshift(myGUI);

const color_active = `#3775D3`;
const color_inactive = `#252627`;
const color_elim = `#A20021`;
const color_grey = `#7E8893`;

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


const poker = new Game(6);

window.addEventListener("load", (e) => { 
    
    document.body.appendChild(popUp);
});

accept.addEventListener('click', (e) => {
    
    document.body.removeChild(popUp);
    poker.manager();
});



function updateHistory (msg) {

    let newItem = document.createElement("li");
    if (alt) newItem.style.backgroundColor = '#596069';
    alt = !alt;

    newItem.appendChild(document.createTextNode(msg));
    historyGUI.prepend(newItem);
}


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

const betSlider = document.getElementById('slider');
betSlider.addEventListener('click', (e) => {

    let myMoney = poker.players[0].money;
    raiseValue = Math.floor(myMoney * (e.target.value / 100) / 10) * 10;

    if (raiseValue == myMoney) raiseButton.value = `All In - $${raiseValue}`;
    else raiseButton.value = `Raise - $${raiseValue}`;
});

const foldButton = document.getElementById('fold');
foldButton.addEventListener('click', (e) => {
    poker.players[0].fold = true;
    updateHistory(`${poker.players[0].name} folded`);
    poker.players[0].endMove();
});

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

function scoreHands(playerArr, comCards) {
    return 0;
}