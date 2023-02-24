class Player {

    static card1;
    static card2;

    /*  GUI  */
    static moneyGUI;
    static blindGUI;

    constructor (name, money, call, fold, elim, index) {
        this.name = name;
        this.money = money;
        this.call = call;
        this.fold = fold;
        this.elim = elim;
        this.index = index;

        this.moneyGUI = playersGUI[index].getElementsByClassName('moneyCount')[0];
        this.blindGUI = playersGUI[index].getElementsByClassName('blind')[0];
    }

    move (recall) {
        checkButton.disabled = false;
        foldButton.disabled = false;
        if (!recall) raiseButton.disabled = false;
        if (recall) raiseButton.style.color = `${color_inactive}`;

        if (poker.minCall - this.call > 0) checkButton.value = `Call: $${poker.minCall - this.call}`;
        else checkButton.value = `Check`;

        const card_bg = document.getElementById('privateCards');
        card_bg.style.backgroundColor = `${color_active}`;

        if (this.money == 0) this.endMove();
        if (poker.getRemPlayers() == 1) this.endMove();
    }

    endMove () {
        checkButton.disabled = true;
        raiseButton.disabled = true;
        foldButton.disabled = true;
        raiseButton.style.color = `white`;
        const card_bg = document.getElementById('privateCards');
        card_bg.style.backgroundColor = `${color_grey}`;

        checkButton.value = `Check`;

        betSlider.value = 0;
        raiseValue = 0;
        raiseButton.value = `Raise - $0`;

        if (poker.recall) poker.secondBet(true);
        else poker.bettingRound(true);
    }
}



class Bot extends Player {

    static nameGUI;

    constructor (name, money, call, fold, elim, index) {
        super(name, money, call, fold, elim, index);

        this.nameGUI = playersGUI[index].getElementsByClassName('names')[0];
    }

    /* take computer turn and reflect in GUI */
    botMove (recall) {
        let bet = this.analyze();

        if (!recall) {

            if (bet > 4) this.raise(bet - 4);
            else if (bet > 2) this.check();
            else this.compFold();

        } else {

            if (bet > 3) this.check();
            else this.compFold();
        }
        

        if (!this.fold) this.nameGUI.style.backgroundColor = `${color_inactive}`;
        else this.nameGUI.style.backgroundColor = `${color_elim}`;
    }

    /* call/check */
    check () {
        let bet = poker.minCall - this.call;
        if (this.money > 0 && poker.minCall > 0) {
            if (this.money >= bet) {
                this.call += bet;
                this.money -= bet;
            } else {
                bet = this.money;
                this.money -= bet;
                this.call += bet;
            }
            this.moneyGUI.innerText = `$${this.money}`;
            poker.curPot += bet;
            potGUI.innerText = `Current Pot: $${poker.curPot}`;
        }
        if (bet <= 0 || this.money == 0) updateHistory(`${this.name} checked`);
        else updateHistory(`${this.name} called $${bet}`);

    }

    /* raise by value + mincall */
    raise (value) {
        let bet = (value * 5) + (poker.minCall - this.call);
        if (this.money >= bet) {
            this.call += bet;
            this.money -= bet;
            this.moneyGUI.innerText = `$${this.money}`;
        
            poker.curPot += bet;
            potGUI.innerText = `Current Pot: $${poker.curPot}`;
            poker.minCall += value * 5;
            callGUI.innerText = `Current minimum call: $${poker.minCall}`;
            
            updateHistory(`${this.name} raised by $${value * 5}`);

        } else this.check();
    }

    /* fold if money is not zero */
    compFold () {
        if (this.money > 0) {
            this.fold = true;
            updateHistory(`${this.name} folded`);
        } else this.check();
    }

    /* return evaluation of hand 1-10 */
    analyze () {
        let r1 = this.getRank(this.card1);
        let r2 = this.getRank(this.card2);
        let mult = Math.floor(Math.random() * 2);
        if (r1 == r2) r1 > 7 ? mult += 5 : mult += 3;
        else {
            r1 > 7 ? mult += 2 : mult += 1;
            r2 > 7 ? mult += 2 : mult += 1;
        }

        if (this.getSuit(this.card1) == this.getSuit(this.card2)) mult += 2;

        if (poker.dealer.dealPhase < 2) return mult;
        


        return mult;
    }

    getSuit (card) {
        return card.slice(1);
    }

    getRank (card) {
        return toNum(card.slice(0,1));
    }
}