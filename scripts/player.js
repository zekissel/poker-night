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

        if (poker.minCall > 0) checkButton.value = `Call: $${poker.minCall}`;
        else checkButton.value = `Check`;

        const card_bg = document.getElementById('privateCards');
        card_bg.style.backgroundColor = `${color_active}`;

        if (poker.getRemPlayers() == 1) this.endMove();
    }

    endMove () {
        checkButton.disabled = true;
        raiseButton.disabled = true;
        foldButton.disabled = true;
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

            if (bet > 5) this.raise(bet - 5);
            else if (bet > 2) this.check();
            else this.fold();

        } else {

            if (bet > 3) this.check();
            else this.fold();
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
        if (bet <= 0) updateHistory(`${this.name} checked`);
        else updateHistory(`${this.name} called $${bet}`);

    }

    /* raise by value + mincall */
    raise (value) {
        let bet = (value * 10) + (poker.minCall - this.call);
        if (this.money >= bet) {
            this.call += bet;
            this.money -= bet;
            this.moneyGUI.innerText = `$${this.money}`;
        
            poker.curPot += bet;
            potGUI.innerText = `Current Pot: $${poker.curPot}`;
            poker.minCall += value * 10;
            callGUI.innerText = `Current minimum call: $${minCall}`;
            
            updateHistory(`${this.name} raised by ${value * 10}`);

        } else this.check();
    }

    /* fold if money is not zero */
    fold () {
        if (this.money > 0) {
            this.fold = true;
            updateHistory(`${this.name} folded`);
        } else this.check();
    }

    /* return evaluation of hand 1-10 */
    analyze () {

        
        return 5;
    }
}