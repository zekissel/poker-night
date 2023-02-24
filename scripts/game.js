const names = [ 'Jaya', 'Ana', 'Bob', 'Cree', 'Dan', 'Etho' ];
const startMoney = 1000;

class Game {

    static dealer;  /* dealer class */

    static numPlayers;
    static players;

    static recall;
    static minCall;
    static bigBlind;
    static curPot;

    constructor (num) {

        this.dealer = new Dealer();

        this.numPlayers = num;
        this.players = [];
        this.players.push(new Player(names[0], startMoney, 0, false, false, 0));    /* first player is user */
        for (let i = 1; i < num; i++) {
            this.players.push(new Bot(names[i], startMoney, 0, false, false, i));   /* the rest are bots */
        }
        this.recall = false;
        this.minCall = 0;
        this.bigBlind = 20;
        this.curPot = 0;
    }

    /* manage phases of deal for each round */
    manager (wait) {

        if (wait === true) return;
        
        switch (this.dealer.dealPhase) {
            case 0: 
                this.dealer.shuffleDeck();
                updateHistory(`Dealing players`);
                this.dealer.dealPlayers(this.players);
                this.postBlinds();
                this.bettingRound();
                break;

            case 1:
                if (this.getRemPlayers() > 1) {
                    updateHistory(`Dealing flop`);
                    this.dealer.dealFlop();
                    this.bettingRound();
                } else this.defaultWinner();
                break;

            case 2:
                if (this.getRemPlayers() > 1) {
                    updateHistory(`Dealing turn`);
                    this.dealer.dealTurn();
                    this.bettingRound();
                } else this.defaultWinner();
                break;

            case 3:
                if (this.getRemPlayers() > 1) {
                    updateHistory(`Dealing river`);
                    this.dealer.dealRiver();
                    this.bettingRound();
                } else this.defaultWinner();
                break;

            case 4:
                if (this.getRemPlayers() > 1) {
                    /* decide winning hand */
                    let winner = showdown(this.players, this.dealer.communityCards);
                    if (Array.isArray(winner)) this.splitWinner(winner);
                    else this.roundWinner(winner);
                } else this.defaultWinner();
                break;

            case 5:
                this.dealer.resetDeal();
                for (let p = 0; p < this.numPlayers; p++) {
                    if (poker.players[p].elim) {
                        if (p != 0) poker.players[p].nameGUI.style.backgroundColor = `${color_elim}`;
                        this.eliminatePlayer(p);
                    }
                }
                this.dealer.curDealer = (this.dealer.curDealer + 1) % poker.numPlayers;
                this.rotateBlinds();
                prompt.nodeValue = `Press 'Deal' to Begin the Next Turn`;
                accept.innerText = `Deal`;
                popUp.appendChild(accept);
                document.body.appendChild(popUp);
                break;
            }
    }

    /* collect small and big blinds and update GUI */
    postBlinds () {
        let sb = (this.dealer.curDealer + 1) % this.numPlayers;
        let bb = (this.dealer.curDealer + 2) % this.numPlayers;

        if (this.players[sb].money >= this.bigBlind / 2) {
            this.players[sb].call = this.bigBlind / 2;
            this.players[sb].money -= this.players[sb].call;
        } else {
            this.players[sb].call = this.players[sb].money
            this.players[sb].money = 0;
        }

        if (this.players[bb].money >= this.bigBlind) {
            this.players[bb].call = this.bigBlind;
            this.players[bb].money -= this.players[bb].call;
        } else {
            this.players[bb].call = this.players[bb].money
            this.players[bb].money = 0;
        }

        this.players[sb].moneyGUI.innerText = `$${this.players[sb].money}`;
        this.players[bb].moneyGUI.innerText = `$${this.players[bb].money}`;

        this.curPot += this.players[sb].call + this.players[bb].call;
        potGUI.innerText = `Current Pot: $${this.curPot}`;

        this.minCall = this.bigBlind;
        callGUI.innerText = `Current minimum call: $${this.minCall}`;
    }

    rotateBlinds () {
        let sb = (this.dealer.curDealer + 1) % this.numPlayers;
        let bb = (this.dealer.curDealer + 2) % this.numPlayers;

        this.players[this.dealer.curDealer].blindGUI.innerText = `D`;
        this.players[sb].blindGUI.innerText = `SB`;
        this.players[bb].blindGUI.innerText = `BB`;
        for (let i = 0; i < this.numPlayers; i++) if (i != sb && i != bb && i != this.dealer.curDealer) 
            this.players[i].blindGUI.innerText = ``;
    }

    /* first round of betting, anyone can call, raise, fold */
    async bettingRound (passed) {

        if (passed) {
            let curMove = 1;
            while (curMove != (this.dealer.curDealer + 3) % this.numPlayers) {
                if (!this.players[curMove].fold) {
                    this.players[curMove].nameGUI.style.backgroundColor = `${color_active}`;
                    await sleep(sleep_timer);
                    this.players[curMove].botMove();
                }
                curMove = (curMove + 1) % this.numPlayers;
            }
            this.secondBet();

        } else {
            let curMove = (this.dealer.curDealer + 3) % this.numPlayers;
            while (curMove != 0) {
                if (!this.players[curMove].fold) {
                    this.players[curMove].nameGUI.style.backgroundColor = `${color_active}`;
                    await sleep(sleep_timer);
                    this.players[curMove].botMove();
                }
                curMove = (curMove + 1) % this.numPlayers;
            }
            if (!this.players[0].fold) this.players[0].move();
            else this.bettingRound(true);
        }
    }

    /* second pass of one betting round, only allows for calling and folding */
    async secondBet (passed) {
        this.recall = true;
        if (passed) {
            this.recall = false;
            let curMove = 1;
            while (curMove != (this.dealer.curDealer + 3) % this.numPlayers) {
                let invcall = this.players[curMove].call < this.minCall;
                if (!this.players[curMove].fold && invcall) {
                    this.players[curMove].nameGUI.style.backgroundColor = `${color_active}`;
                    await sleep(sleep_timer);
                    this.players[curMove].botMove(true);
                }
                curMove = (curMove + 1) % this.numPlayers;
            }
            this.resetBets();

        } else {
            let curMove = (this.dealer.curDealer + 3) % this.numPlayers;
            while (curMove != 0) {
                let invcall = this.players[curMove].call < this.minCall;
                if (!this.players[curMove].fold && invcall) {
                    this.players[curMove].nameGUI.style.backgroundColor = `${color_active}`;
                    await sleep(sleep_timer);
                    this.players[curMove].botMove(true);
                }
                curMove = (curMove + 1) % this.numPlayers;
            }
            if (!this.players[0].fold && this.players[0].call < this.minCall) this.players[0].move(true);
            else this.secondBet(true);
        }
    }

    /* reset mincall and player calls */
    resetBets () {
        for (let p of this.players) p.call = 0;
        this.minCall = 0;
        callGUI.innerText = `Current minimum call: $${this.minCall}`;
        this.manager();
    }

    /* single winner after a showdown round */
    roundWinner (ind) {
        let msg = `Pot of $${this.curPot} goes to ${this.players[ind].name}.`

        this.players[ind].money += this.curPot;
        this.players[ind].moneyGUI.innerText = `$${this.players[ind].money}`;

        this.nextRound(msg);
    }

    splitWinner (indices) {
        let msg = `Pot of $${this.curPot} split between `;
        let share = this.curPot / indices.length;
        for (let i = 0; i < indices.length; i++) {
            this.players[indices[i]].money += share;
            this.players[indices[i]].moneyGUI.innerText = `$${this.players[indices[i]].money}`;
            msg += `${this.players[indices[i]].name}, `;
        }
        msg = msg.slice(0, -2);
        let c = msg.lastIndexOf(',');
        msg = msg.substring(0, c) + ' and' + msg.substring(c + 1);
        this.nextRound(msg);
    }

    /* single winner because all others folded */
    defaultWinner () {
        let ind = 0;
        while (poker.players[ind].fold) ind++;

        let msg = `Everyone folded! $${this.curPot} goes to ${this.players[ind].name}.`;
        this.players[ind].money += this.curPot;
        this.players[ind].moneyGUI.innerText = `$${this.players[ind].money}`;

        this.nextRound(msg);
    }

    nextRound (msg) {

        this.curPot = 0;
        potGUI.innerText = `Current Pot: $${this.curPot}`;

        this.dealer.dealPhase = 5;
        prompt.nodeValue = msg;
        accept.innerText = `Continue`;
        document.body.appendChild(popUp);
    }

    /* return number of players not folded */
    getRemPlayers () {
        let ret = 0;
        for (let p in this.players) if (!p.fold) ret++;
        return ret;
    }

    /* remove player at index from players[] */
    eliminatePlayer (ind) {
        this.players.splice(ind, 1);
        this.numPlayers--;
        for (let i = ind; i < this.numPlayers; i++) {
            this.players[i].index--;
        }
    }
}

class Dealer {

    static cardDeck;
    static curCard;

    static curDealer;
    static dealPhase;

    static communityCards;

    constructor () {
        this.cardDeck = [];
        for (let c = 0; c < 52; c++) {
            this.cardDeck[c] = getRank(c) + getSuit(c);
        }
        this.communityCards = [5];
        this.curCard = 0;
        this.curDealer = 0;
        this.dealPhase = 0;
    }

    /* deal all players two cards in a cyclic fashion, starting from left of dealer */
    dealPlayers (playersArr) {
        let numPlayers = playersArr.length;
        for (let n = 1; n <= numPlayers; n++) {
            let ind = (n + this.curDealer) % numPlayers;
            if (!playersArr[ind].fold) playersArr[ind].card1 = this.cardDeck[this.curCard++];
        }
        for (let n = 1; n <= numPlayers; n++) {
            let ind = (n + this.curDealer) % numPlayers;
            if (!playersArr[ind].fold) playersArr[ind].card2 = this.cardDeck[this.curCard++];
        }

        /* update GUI */
        privCardGUI[0].innerText = playersArr[0].card1;
        privCardGUI[1].innerText = playersArr[0].card2;
        this.dealPhase++;
    }

    dealFlop () {
        for (let i = 0; i < 3; i++) {
            this.communityCards[i] = this.cardDeck[this.curCard++];
            comCardGUI[i].innerText = this.communityCards[i];
        }
        this.dealPhase++;
    }

    dealTurn () {
        this.communityCards[3] = this.cardDeck[this.curCard++];
        comCardGUI[3].innerText = this.communityCards[3];
        this.dealPhase++;
    }
    
    dealRiver () {
        this.communityCards[4] = this.cardDeck[this.curCard++];
        comCardGUI[4].innerText = this.communityCards[4];
        this.dealPhase++;
    }

    /* revoke player and community cards, reset phase */
    resetDeal () {
        for (let n = 0; n < poker.numPlayers; n++) {
            if (poker.players[n].money == 0) poker.players[n].elim = true;
        }

        for (let n = 0; n < poker.numPlayers; n++) {
            poker.players[n].card1 = '';
            poker.players[n].card2 = '';
            if (!poker.players[n].elim) poker.players[n].fold = false;
            else poker.players[n].fold = true;
        }
        
        for (let c in this.communityCards) c = '';
        for (let g of comCardGUI) g.innerText = '';
        for (let g of privCardGUI) g.innerText = '';
        this.dealPhase = 0;
        historyGUI.innerText = '';
    }

    /* randomize card order and reset draw count*/
    shuffleDeck () {
        for (let n = 0; n < 3; n++) {
            for (let x = 0; x < 52; x++) {
                let y = Math.floor(Math.random() * 52);
                let temp = this.cardDeck[y];
                this.cardDeck[y] = this.cardDeck[x];
                this.cardDeck[x] = temp;
            }
        }
        this.curCard = 0;
    }
}

/* map index/52 to 13 different ranks */
function getRank (index) {
    switch (index % 13) {
        case 0: return 'A'; case 1: return '2'; case 2: return '3'; case 3: return '4';
        case 4: return '5'; case 5: return '6'; case 6: return '7'; case 7: return '8';
        case 8: return '9'; case 9: return 'T'; case 10: return 'J'; case 11: return 'Q';
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