/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code that contains logic of game with card, player, and game objects. The objects
    are used to make the game function.
*/

const evaluator = require("./evaluator");

//card object
class card {
    constructor(string, value, count, img) {
        this.string = string;
        this.value = value;
        this.count = count;
        this.img = img;
    }
    //returns string representation of card
    toString() {
        return this.string;
    }
}

//hand object
class hand {
    constructor(initialBet) {
        this.cards = []
        this.value = 0
        this.standing = false;
        this.bust = false;
        this.bet = initialBet || 0;
    }
    //returns string representation of hand
    toString() {
        return this.cards.join("\n  ")
    }
    /**
     * adds a card object to the hand
     * @param {card} c 
     */
    addCard(c) {
        this.cards.push(c);
        this.value += c.value;
        if (this.value > 21) {
            this.bust = true;
        }
    }
    /**
    * adds a card object to the hand at position 0
    * @param {card} c 
    */
    addCardToFront(c) {
        this.cards.unshift(c);
        this.value += c.value;
    }
    /**
     * splits hand by returning a second hand object containing 
     * the second card of the original
     * @returns a new hand with one card beign the split card
     */
    split() {
        var splitHand = new hand(this.bet);
        this.value -= this.cards[1].value;
        splitHand.addCard(this.cards.pop());

        return (splitHand);
    }
    //checks if the player has not stood or busted
    isActive() {
        return (this.getValue() < 21 && this.standing == false);
    }
    //checks for an ace
    isSoft() {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].string[0] === "A" && this.value + 10 <= 21) {
                return true;
            }
        }
        return false;
    }
    //returns value of hand accounting for aces
    getValue() {
        if (this.isSoft() && this.value + 10 < 22) {
            return this.value + 10;
        }
        return this.value;
    }
    //returns true if hand is legal to split.
    canSplit() {
        if (this.cards.length != 2) {
            return false;
        }
        return this.cards[0].value == this.cards[1].value;
    }
    //returns the cards array
    getCards() {
        return this.cards;
    }
    //size of hand
    size() {
        return this.cards.length;
    }
}

//player object
class player {
    constructor(name, startingBal) {
        this.name = name;
        this.bal = startingBal;
        this.hands = [];
        this.curHand = 0;
        this.initialBet = -1;
        this.insuranceBet = -1;
        this.correctMoves = 0;
        this.mistakes = 0;
        this.amountWon = 0;
        this.amountLost = 0;
        this.lastPing = Date.now();
    }
}

class gamePhase {
    static betting = new gamePhase("betting");
    static dealing = new gamePhase("dealing");
    static insurance = new gamePhase("insurance");
    static playing = new gamePhase("playing");
    static inactive = new gamePhase("inactive");

    constructor(name) {
        this.name = name;
    }
    //returns string representation of game phase
    toString() {
        return this.name;
    }
}

const faceDownCard = new card("FD", 0, 0, "FD.png");

const aceTestDeck = [
    new card("KS", 10, -1, "KS.png"), new card("KS", 10, -1, "KS.png"), new card("KS", 10, -1, "KS.png")]

//standard 52 card deck
const deck = [
    new card("2S", 2, 1, "2S.png"),
    new card("3S", 3, 1, "3S.png"),
    new card("4S", 4, 1, "4S.png"),
    new card("5S", 5, 1, "5S.png"),
    new card("6S", 6, 1, "6S.png"),
    new card("7S", 7, 0, "7S.png"),
    new card("8S", 8, 0, "8S.png"),
    new card("9S", 9, 0, "9S.png"),
    new card("10S", 10, -1, "10S.png"),
    new card("JS", 10, -1, "JS.png"),
    new card("QS", 10, -1, "QS.png"),
    new card("KS", 10, -1, "KS.png"),
    new card("AS", 1, -1, "AS.png"),

    new card("2C", 2, 1, "2C.png"),
    new card("3C", 3, 1, "3C.png"),
    new card("4C", 4, 1, "4C.png"),
    new card("5C", 5, 1, "5C.png"),
    new card("6C", 6, 1, "6C.png"),
    new card("7C", 7, 0, "7C.png"),
    new card("8C", 8, 0, "8C.png"),
    new card("9C", 9, 0, "9C.png"),
    new card("10C", 10, -1, "10C.png"),
    new card("JC", 10, -1, "JC.png"),
    new card("QC", 10, -1, "QC.png"),
    new card("KC", 10, -1, "KC.png"),
    new card("AC", 1, -1, "AC.png"),

    new card("2D", 2, 1, "2D.png"),
    new card("3D", 3, 1, "3D.png"),
    new card("4D", 4, 1, "4D.png"),
    new card("5D", 5, 1, "5D.png"),
    new card("6D", 6, 1, "6D.png"),
    new card("7D", 7, 0, "7D.png"),
    new card("8D", 8, 0, "8D.png"),
    new card("9D", 9, 0, "9D.png"),
    new card("10D", 10, -1, "10D.png"),
    new card("JD", 10, -1, "JD.png"),
    new card("QD", 10, -1, "QD.png"),
    new card("KD", 10, -1, "KD.png"),
    new card("AD", 1, -1, "AD.png"),

    new card("2H", 2, 1, "2H.png"),
    new card("3H", 3, 1, "3H.png"),
    new card("4H", 4, 1, "4H.png"),
    new card("5H", 5, 1, "5H.png"),
    new card("6H", 6, 1, "6H.png"),
    new card("7H", 7, 0, "7H.png"),
    new card("8H", 8, 0, "8H.png"),
    new card("9H", 9, 0, "9H.png"),
    new card("10H", 10, -1, "10H.png"),
    new card("JH", 10, -1, "JH.png"),
    new card("QH", 10, -1, "QH.png"),
    new card("KH", 10, -1, "KH.png"),
    new card("AH", 1, -1, "AH.png")
]

/**
 * This function uses the Fisher-Yates algorith to shuffle the passed in array.
 * Iterates through in order and swaps the element at the current index with one 
 * at a random index.
 * @param {object[]} arr 
 */
function shuffleList(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

/**
 * waits a specified number of milliseconds
 * @param {number} milliseconds 
 * @returns promise that resolves when wait is over
 */
function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * checks if string is an integer
 * @param {String} str
 * @returns 
 */
function isInt(str) {
    if (typeof str != "string") { return false; }
    if ((/^[0-9]+$/.test(str))) { return true; }
    return false;
}

//game object
class game {
    //constructor
    constructor(gameConfig, playerNames) {
        //populates player array
        this.players = []
        for (var i = 0; i < playerNames.length; i++) {
            this.players.push(new player(playerNames[i], gameConfig.startMoney));
        }

        //creates dealer
        this.dealer = {};
        this.dealer.downCard = null;
        this.dealer.upCards = new hand();

        //sets game settings
        this.numDecks = gameConfig.numDecks;
        this.shuffleAt = gameConfig.shuffleAt;
        this.insurance = gameConfig.insurance;
        this.blackjackPay = gameConfig.blackjackPay;
        this.minBet = gameConfig.minBet;
        this.maxBet = gameConfig.maxBet;
        this.h17 = gameConfig.h17;
        this.feedback = gameConfig.feedback;

        console.log(this.h17 + " " + this.feedback)

        //initializes game variables
        this.count = 0;
        this.trueCount = 0;
        this.shoe = [];
        this.discard = [];
        this.activePlayer = 0;
        this.phase = gamePhase.betting;
        this.message = [true, ""];

        this.resetshoe();
    }

    /**
     * Removes player with specified name from the game.
     * @param {String} playerName 
     */
    removePlayer(playerName) {
        console.log("removing " + playerName)
        for (var i = 0; i < this.players.length; i++) {
            if (this.phase == gamePhase.playing && this.players[this.activePlayer].name === playerName) {
                this.passTurn();
            }
            let p = this.players[i];
            if (p.name !== playerName) { continue; }
            let retVal = [p.amountLost, p.amountWon, p.correctMoves, p.mistakes];
            this.players.splice(i, 1);
            if (i <= this.activePlayer) {
                this.activePlayer -= 1;
            }
            return retVal;
        }
        return [0, 0, 0, 0];
    }

    //Passes turn to next player and skips players who already have blackjack
    passTurn() {
        this.activePlayer += 1;
        if (this.activePlayer >= this.players.length) {
            this.endRound();
            return;
        }
        var p = this.players[this.activePlayer];
        if (p.hands[p.curHand].getValue() == 21) {
            this.passTurn();
        }
    }

    //moves to player p's next hand.
    nextHand(p) {
        p.curHand -= 1;
        if (p.curHand < 0) {
            this.passTurn();
            return;
        }
        if (p.hands[p.curHand].getValue() == 21) {
            this.nextHand(p);
        }
    }

    //returns the number of players in the game
    playerCount() {
        return this.players.length;
    }

    //prints the shoe
    printShoe() {
        for (var i = 0; i < this.shoe.length; i++) {
            console.log(this.shoe[i]);
        }
    }

    //draws card from the shoe and returns it
    drawCard() {
        var retval = this.shoe.pop();
        this.count += retval.count;
        this.trueCount = (this.count / (Math.round(this.shoe.length / 26) / 2));
        console.log("count:" + this.count);
        console.log("tcount:" + this.trueCount);
        return retval;
    }

    /**
     * 
     * @returns a JSON string with all game configs required by clients
     */
    getGameConfig() {
        var config = {};
        config.maxBet = this.maxBet;
        config.minBet = this.minBet;
        config.insurance = this.insurance;
        config.blackjackPay = this.blackjackPay;
        config.numDecks = this.numDecks;
        return JSON.stringify(config);
    }

    isInactive(username) {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.name === username) {
                return ((Date.now() - p.lastPing > 10000) || ((p.bal < this.minBet) && p.hands.length == 0 && p.initialBet == -1));
            }
        }
    }

    /**
     * returns a json object that represents the game information to be sent to clients
     * @returns {String} json representation of the game
     */
    getGameState(username) {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.name === username) {
                p.lastPing = Date.now();
            }
        }
        var state = {};
        state.players = this.players;
        state.dealer = {}
        this.dealer.downCard ? state.dealer.downCard = faceDownCard : state.dealer.downCard = null;
        state.dealer.upCards = this.dealer.upCards;
        state.phase = this.phase.toString();
        state.activePlayer = this.activePlayer;
        state.cardsInShoe = this.shoe.length;
        state.numDecks = this.numDecks;
        if (this.feedback) {
            state.message = this.message;
        }
        return JSON.stringify(state);
    }

    //prints the status of the game
    printGame() {
        console.log("=================================\n");
        console.log("++Dealer++");
        console.log(" down card:");
        console.log("  " + this.dealer.downCard);
        console.log(" up cards:");
        console.log("  " + this.dealer.upCards);
        console.log("++Dealer++\n");

        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            console.log("++" + p.name + "++");
            console.log(" bal: " + p.bal);
            for (var k = 0; k < p.hands.length; k++) {
                console.log(" bet: " + p.hands[k].bet);
                console.log(" h" + k + ":");
                console.log("  " + p.hands[k].toString());
            }
            console.log("++" + p.name + "++\n");
        }
        console.log("=================================");
    }

    //puts all cards back into the shoe and shuffles
    resetshoe() {
        this.shoe = [];
        this.discard = [];
        for (var i = 0; i < this.numDecks; i++) {
            this.shoe = this.shoe.concat(deck);
        }
        shuffleList(this.shoe);
    }

    //deals the initial 2 card hands for the player and dealer
    dealHands() {
        this.message = [true, ""];
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.hands = [new hand(p.initialBet)];
            p.hands[0].addCard(this.drawCard());
            p.hands[0].addCard(this.drawCard());
        }
        this.dealer.downCard = this.drawCard();
        this.dealer.upCards.addCard(this.drawCard());
        if (this.dealer.upCards.isSoft()) {
            this.phase = gamePhase.insurance;
        } else {
            if (this.dealerHasBlackJack()) {
                this.endRound();
            } else {
                this.phase = gamePhase.playing;
                this.activePlayer = -1;
                this.passTurn();
            }
        }
    }

    //returns true or false if dealer has black jack
    dealerHasBlackJack() {
        var tempHand = new hand();
        tempHand.addCard(this.dealer.upCards.getCards()[0]);
        tempHand.addCard(this.dealer.downCard);
        return (tempHand.getValue() == 21);
    }

    /**
     * checks if playerName is the active player and stands the current hand if they are.
     * @param {String} playerName 
     * @returns string representing the result of the hit stand
     */
    stand(playerName) {
        if (this.phase != gamePhase.playing) {
            return "cant stand because the phase is not playing"
        }
        var p = this.players[this.activePlayer];
        if (!p || !(playerName === p.name)) { return "It is not your turn."; }
        p.hands[p.curHand].standing = true;

        var upcardValue = this.dealer.upCards.getValue();

        var values = evaluator.eval(p.hands[p.curHand], "stand", this.trueCount, upcardValue, this.h17);
        this.message = values;
        values[0] ? p.correctMoves++ : p.mistakes++

        console.log(values);

        if (p.curHand != 0) {
            p.curHand -= 1;
            return "stood";
        }

        this.passTurn();
        return "stood";
    }

    /**
     * checks if playerName is the active player and hits the current hand if they are.
     * @param {String} playerName 
     * @returns string representing the result of the hit request
     */
    hit(playerName) {
        if (this.phase != gamePhase.playing) {
            return "cant hit because the phase is not playing"
        }
        var p = this.players[this.activePlayer];
        if (!p || !(playerName === p.name)) { return "It is not your turn."; }

        var upcardValue = this.dealer.upCards.getValue();
        var values = evaluator.eval(p.hands[p.curHand], "hit", this.trueCount, upcardValue, this.h17);
        this.message = values;
        values[0] ? p.correctMoves++ : p.mistakes++

        p.hands[p.curHand].addCard(this.drawCard());
        if (p.hands[p.curHand].isActive()) {
            return "hit";
        }

        if (p.curHand != 0) {
            this.nextHand(p);
            return "hit";
        }
        this.passTurn();
        return "hit";
    }

    /**
     * checks if playerName is the active player and doubles down on the current hand if true.
     * @param {String} playerName 
     * @returns string representing the result of the double request
     */
    double(playerName) {
        if (this.phase != gamePhase.playing) {
            return "cant double because the phase is not playing"
        }
        var p = this.players[this.activePlayer];
        if (!p || !(playerName === p.name)) { return "It is not your turn."; }
        var bet = p.hands[p.curHand].bet;
        if (bet > p.bal) { return "not enough money to double." }

        var upcardValue = this.dealer.upCards.getValue();
        var values = evaluator.eval(p.hands[p.curHand], "double", this.trueCount, upcardValue, this.h17);
        this.message = values;
        values[0] ? p.correctMoves++ : p.mistakes++

        p.hands[p.curHand].addCard(this.drawCard());
        p.hands[p.curHand].bet *= 2;
        p.bal -= bet;

        if (p.curHand != 0) {
            this.nextHand(p);
            return "doubled";
        }

        this.passTurn();
        return "doubled";
    }

    /**
     * checks if playerName is the active player and splits the current 
     * hand if they are and it is legal to do so.
     * @param {String} playerName 
     * @returns string representing the result of the hit request
     */
    split(playerName) {
        if (this.phase != gamePhase.playing) {
            return "cant split because the phase is not playing"
        }
        var p = this.players[this.activePlayer];
        if (!p || !(playerName === p.name)) { return "It is not your turn."; }
        if (!p.hands[p.curHand].canSplit()) {
            return "this hand can not be split";
        }
        if (p.hands.length >= 4) {
            return "you have already split 4 times"
        }
        var bet = p.hands[p.curHand].bet;
        if (bet > p.bal) { return "not enough money to split." }

        var upcardValue = this.dealer.upCards.getValue();
        var values = evaluator.eval(p.hands[p.curHand], "split", this.trueCount, upcardValue, this.h17);
        this.message = values;
        values[0] ? p.correctMoves++ : p.mistakes++

        p.hands.splice(p.curHand + 1, 0, p.hands[p.curHand].split());

        p.hands[p.curHand].addCard(this.drawCard());
        p.curHand += 1;
        p.hands[p.curHand].addCard(this.drawCard());
        if (p.hands[p.curHand].getValue() == 21) {
            this.nextHand(p);
        }
        p.bal -= bet;
        return "split";
    }

    /**
     * sets the bet of the specified player
     * @param {String} playerName 
     * @param {String} bet 
     * @returns string representing the result of the bet request
     */
    setBet(playerName, bet) {
        if (!isInt(bet)) { return "requested bet is not an integer"; }
        bet = parseInt(bet);
        if (this.phase != gamePhase.betting) {
            return "cant bet because the phase is not betting"
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.name !== playerName) { continue; }
            if (bet > this.maxBet) { return "Your bet is greater than table max."; }
            if (bet > p.bal) { return "you don't have enough money."; }
            if (bet < this.minBet) { return "Your bet is less than table min."; }
            if (p.initialBet != -1) { return "you have already bet" }
            p.initialBet = bet;
            p.bal -= bet;
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            console.log(this.players);
            if (p.initialBet == -1) {
                console.log("some one has not bet");
                break
            }
            console.log(this.players);
            if (i == this.players.length - 1) {
                console.log("every one has bet");
                this.phase = gamePhase.dealing;
                this.dealHands();
            }
        }
        return "bet placed";
    }

    /**
     * sets the bet of the specified player
     * @param {String} playerName 
     * @param {String} bet 
     * @returns string representing the result of the insurance request
     */
    setInsuranceBet(playerName, bet) {
        if (!isInt(bet)) { return "requested bet is not an integer"; }
        bet = parseInt(bet);
        if (this.phase != gamePhase.insurance) {
            return "cant insure because the phase is not insurance"
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.name !== playerName) { continue; }
            if (bet > this.maxBet) { return "Your bet is greater than table max."; }
            if (bet > p.bal) { return "you don't have enough money."; }
            if (bet < this.minBet && bet != 0) { return "Your bet is less than table min."; }
            if (p.insuranceBet != -1) { return "you have already bet" }
            if (this.trueCount >= 3) {
                var messageText = "It is correct to take insurance now."
                if (bet > 0) {
                    this.correctMoves++
                    this.message = [true, messageText];
                } else {
                    this.mistakes++;
                    this.message = [false, messageText];
                }

            } else {
                var messageText = "It is not correct to take insurance here."
                if (bet > 0) {
                    this.mistakes++;
                    this.message = [false, messageText];
                } else {
                    this.correctMoves++;
                    this.message = [true, messageText];
                }
            }
            p.insuranceBet = bet;
            p.bal -= bet;
        }
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.insuranceBet == -1) { break }
            if (i == this.players.length - 1) {
                if (this.dealerHasBlackJack()) {
                    this.endRound();
                } else {
                    this.phase = gamePhase.playing;
                    this.activePlayer = -1;
                    this.passTurn();
                    this.resetInsurance();
                }
            }
        }
        return "bet placed";
    }

    //sets the insurance bets of each player to the default value of -1.
    resetInsurance() {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.insuranceBet = -1;
        }
    }

    //called whent the last player has taken their turn
    async endRound() {
        //this.printGame();
        try {
            this.phase = gamePhase.inactive;
            this.activePlayer = -1;
            await this.dealerPlays();
            this.payOut();
            if (this.shoe.length <= this.shuffleAt) {
                this.resetshoe();
            }
            this.phase = gamePhase.betting;
        } catch (error) {
            console.error(error);
            console.log("game is over");
        }

    }

    //dealer plays out the hand
    async dealerPlays() {
        await wait(2000);
        this.dealer.upCards.addCardToFront(this.dealer.downCard);
        this.dealer.downCard = null;
        while (this.dealer.upCards.getValue() < 17 || (this.dealer.upCards.getValue() == 17 && this.dealer.upCards.isSoft() && this.h17)) {
            await wait(2000);
            this.dealer.upCards.addCard(this.drawCard());
        }
        await wait(5000);
    }

    //after all hands have been played payout is calculated
    payOut() {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            var dealerValue = this.dealer.upCards.getValue()
            if (dealerValue == 21 && this.dealer.upCards.size() == 2 && p.insuranceBet != -1) { //insurance payout
                var insurancePay = p.insuranceBet * (this.insurance);
                console.log(p.name + "has won " + insurancePay + " from insurance.");
                p.amountWon += insurancePay;
                p.bal += insurancePay + p.insuranceBet;
            }
            for (var k = 0; k < p.hands.length; k++) {
                var handSize = p.hands[k].size();
                var handValue = p.hands[k].getValue()
                var bet = p.hands[k].bet;
                console.log(p.name + "'s hand is a " + handValue + " vs. the dealer's " + dealerValue + ".");
                if (handValue > 21) { //player busts
                    console.log(p.name + " has lost " + bet + ".");
                    p.amountLost += bet;
                    continue;
                }
                if (dealerValue == handValue) { //push
                    console.log("The hand is a push for " + p.name + ".");
                    p.bal += bet;
                    continue;
                }
                if (handValue == 21 && handSize == 2) { //blackjack
                    var pay = bet * this.blackjackPay
                    console.log(p.name + " has won " + pay + ".");
                    p.amountWon += bet + pay;
                    p.bal += bet + pay;
                    continue;
                }
                if (dealerValue < handValue) { //Players hand is greater than the dealer without busting
                    console.log(p.name + " has won " + bet + ".");
                    p.amountWon += bet;
                    p.bal += 2 * bet;
                    continue;
                }
                if (handValue < dealerValue && dealerValue < 22) { //dealers hand is greater than the player without busting
                    console.log(p.name + " has lost " + bet + ".");
                    p.amountLost += bet;
                    continue;
                }
                if (dealerValue > 21) { //dealer busts and player does not
                    console.log(p.name + " has won " + bet + ".");
                    p.amountWon += bet;
                    p.bal += 2 * bet;
                    continue;
                }
                this.discard.concat(p.hands[k].getCards);
            }
            p.hands = [];
            p.initialBet = -1;
            p.insuranceBet = -1;
        }
        this.discard.concat(this.dealer.upCards.getCards);
        this.dealer.upCards = new hand();
    }
}

module.exports = game;