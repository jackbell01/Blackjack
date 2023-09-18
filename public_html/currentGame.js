/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code that is used for game.html. Used for displaying cards
    and the working buttons for the various actions that the user can do
    during the game.
*/

const gameDiv = document.getElementById("gameDiv");

const leave = document.getElementById("leave");

const standButton = document.getElementById("stand");
const hitButton = document.getElementById("hit");
const doubleButton = document.getElementById("double");
const splitButton = document.getElementById("split");

const betLable = document.getElementById("betLable");
const bet = document.getElementById("bet");
const placeBet = document.getElementById("placeBet");

const insuranceBetLable = document.getElementById("insuranceBetLable");
const insuranceBet = document.getElementById("insuranceBet");
const placeInsuranceBet = document.getElementById("placeInsuranceBet");
const noInsurance = document.getElementById("noInsurance");

const dealerDiv = document.getElementById("dealerDiv");
const playersDiv = document.getElementById("playersDiv");

const CUR_HAND_BORDER = "thick solid #a3a3a3";

const shoelable = document.getElementById("shoelable");
const shoeContainer = document.getElementById("shoeContainer");
const shoe = document.getElementById("shoe");

//puts the card images on the screen
function renderHands(gameState, plr, div) {
    var hands = plr.hands
    var handsDiv = document.createElement("div");
    handsDiv.className = "handsDiv"
    div.appendChild(handsDiv);

    for (var h = 0; h < hands.length; h++) {
        var handDiv = document.createElement("div");
        handDiv.className = "handDiv"
        handDiv.style.width = "auto";
        handDiv.style.height = ((1 / hands.length) * 100) + "%";
        handsDiv.appendChild(handDiv);
        var cards = hands[h].cards;
        for (var i = 0; i < cards.length; i++) {
            c = cards[i];
            let cardImg = document.createElement("img");
            cardImg.className = "cardImg";
            cardImg.src = "/cards_img/" + c.img;
            var activePlayer = gameState.activePlayer;
            if (gameState.activePlayer < 0) {
                handDiv.appendChild(cardImg);
                continue;
            }
            if (h == plr.curHand && gameState.players[gameState.activePlayer].name == plr.name) {
                cardImg.style.borderTop = CUR_HAND_BORDER;
                cardImg.style.borderBottom = CUR_HAND_BORDER;
                if (i == 0) {
                    cardImg.style.borderLeft = CUR_HAND_BORDER;
                }
                if (i == cards.length - 1) {
                    cardImg.style.borderRight = CUR_HAND_BORDER;
                }
            }
            handDiv.appendChild(cardImg);
        }
    }
}

//puts the dealer card images on the screen.
function renderDealerHand(gameState) {
    var handsDiv = document.createElement("div");
    handsDiv.className = "handsDiv"
    handsDiv.style.width = "100%"
    handsDiv.height = "150px"
    dealerDiv.appendChild(handsDiv);
    if (gameState.dealer.downCard) {
        let fd = document.createElement("img");
        fd.src = "/cards_img/FD.png";
        fd.className = "cardImg";
        if (gameState.phase == "inactive") {
            fd.style.borderTop = CUR_HAND_BORDER;
            fd.style.borderBottom = CUR_HAND_BORDER;
            fd.style.borderLeft = CUR_HAND_BORDER;
        }
        handsDiv.appendChild(fd);
    }
    var cards = gameState.dealer.upCards.cards;
    for (var i = 0; i < cards.length; i++) {
        c = cards[i];
        let cardImg = document.createElement("img");
        cardImg.className = "cardImg";
        cardImg.src = "/cards_img/" + c.img;
        if (gameState.phase == "inactive") {
            cardImg.style.borderTop = CUR_HAND_BORDER;
            cardImg.style.borderBottom = CUR_HAND_BORDER;
            if (i == 0 && i != cards.length - 1) {
                cardImg.style.borderLeft = CUR_HAND_BORDER;
            }
            if (i == cards.length - 1) {
                cardImg.style.borderRight = CUR_HAND_BORDER;
            }
        }
        handsDiv.appendChild(cardImg);
    }
}

//returns string of player username from cookie.
function getUsernameFromCookie() {
    var c = document.cookie
    c = c.substring(33);
    c = c.replace(/%.*/, '');
    return c;
}

//returns true or false if hand can be split
function canSplit(hand, hands) {
    if (hand.cards.length != 2) {
        return false;
    }
    if (hands.length >= 4) {
        return false;
    }
    return hand.cards[0].value == hand.cards[1].value;
}

//toggles the visibility of UI elements based on what moves are legal
function displayLegalMoves(gameState) {
    var u = getUsernameFromCookie();
    if (gameState.activePlayer < 0 || gameState.players[gameState.activePlayer].name !== u) {
        standButton.style.display = "none";
        hitButton.style.display = "none";
        doubleButton.style.display = "none";
        splitButton.style.display = "none";

    } else if (gameState.phase === "playing") {
        var p = gameState.players[gameState.activePlayer]
        standButton.style.display = "inline-block";
        hitButton.style.display = "inline-block";
        doubleButton.style.display = "inline-block";
        if (canSplit(p.hands[p.curHand], p.hands)) {
            splitButton.style.display = "inline-block";
        } else {
            splitButton.style.display = "none";
        }

    }
    if (gameState.phase === "betting") {
        bet.style.display = "inline-block";
        betLable.style.display = "inline-block";
        placeBet.style.display = "inline-block";

    } else {
        bet.style.display = "none";
        betLable.style.display = "none";
        placeBet.style.display = "none";
    }
    if (gameState.phase === "insurance") {
        insuranceBet.style.display = "inline-block";
        insuranceBetLable.style.display = "inline-block";
        placeInsuranceBet.style.display = "inline-block";
        noInsurance.style.display = "inline-block";
    } else {
        insuranceBet.style.display = "none";
        insuranceBetLable.style.display = "none";
        placeInsuranceBet.style.display = "none";
        noInsurance.style.display = "none";
    }
}

// displays the player divs
function displayPlayerDivs(gameState) {
    playersDiv.innerHTML = "";
    let players = gameState.players;
    let playerDivWidth = (1 / players.length) * 100;
    for (var i = players.length - 1; i >= 0; i--) {
        var plr = players[i];
        let playerDiv = document.createElement("div");
        playerDiv.className = "playerDiv";
        playerDiv.style.width = "" + playerDivWidth + "%"
        playersDiv.appendChild(playerDiv);

        let playerNameTag = document.createElement("h1");
        playerNameTag.innerHTML = plr.name;
        playerDiv.appendChild(playerNameTag);

        let bal = document.createElement("h2");
        bal.innerHTML = "Balance: " + plr.bal;
        playerDiv.appendChild(bal);

        if (plr.hands.length != 0) {
            let curBet = document.createElement("h2");
            curBet.innerHTML = "Bet: " + (plr.hands[plr.curHand].bet * plr.hands.length);
            playerDiv.appendChild(curBet);
        }

        let insuranceBet = document.createElement("h2");
        if (plr.insuranceBet != -1) {
            insuranceBet.innerHTML = "Insurance Bet: " + plr.insuranceBet;
        } else {
            insuranceBet.innerHTML = " ";
        }
        playerDiv.appendChild(insuranceBet);

        if (gameState.phase !== "betting") {
            renderHands(gameState, plr, playerDiv);
        }
    }
}

//called every few milliseconds
function update() {
    fetch('/game/getState').then((response) => {
        return response.json();
    }).then((gameState) => {
        shoelable.innerHTML = "Decks remaining out of " + gameState.numDecks + " deck shoe:"
        shoe.style.width = (gameState.cardsInShoe / (gameState.numDecks * 52)) * 100 + "%";
        console.log(gameState.cardsInShoe / (gameState.numDecks * 52))
        dealerDiv.innerHTML = "";
        let dealerNameTag = document.createElement("h1");
        dealerNameTag.innerHTML = "Dealer";
        dealerDiv.appendChild(dealerNameTag);

        if (gameState.message && gameState.phase != "betting") {
            let advice = document.createElement("h3");
            advice.innerHTML = "" + gameState.message[1];
            console.log(gameState.message[0])
            if (gameState.message[0] == false) {
                advice.style.color = "#570303";
            }
            dealerDiv.appendChild(advice);
        }

        renderDealerHand(gameState);
        displayPlayerDivs(gameState);
        displayLegalMoves(gameState);
    }).catch((error) => {
        window.location.href = "index.html";
    });
}

leave.addEventListener("click", () => {
    fetch('/game/leave').then((response) => {
        return response.text();
    }).then((text) => {
        if (text.includes('Left game')) {
            console.log('Left game');
            window.location.href = '/home.html';
        }
    })
})

standButton.addEventListener("click", () => {
    fetch('/game/stand');
})

hitButton.addEventListener("click", () => {
    fetch('/game/hit');
})

doubleButton.addEventListener("click", () => {
    fetch('/game/double');
})

splitButton.addEventListener("click", () => {
    fetch('/game/split');
})

placeBet.addEventListener("click", () => {
    fetch('/game/placeBet/' + bet.value);
})

placeInsuranceBet.addEventListener("click", () => {
    fetch('/game/placeInsuranceBet/' + insuranceBet.value);
})

noInsurance.addEventListener("click", () => {
    fetch('/game/placeInsuranceBet/' + 0);
})

fetch('/game/getConfig').then((response) => {
    return response.json();
}).then((gameConfig) => {
    bet.max = gameConfig.maxBet;
    bet.min = gameConfig.minBet;
    bet.value = gameConfig.minBet;

    insuranceBet.max = gameConfig.maxBet;
    insuranceBet.min = gameConfig.minBet;
    insuranceBet.value = gameConfig.minBet;
})

setInterval(update, 250);
