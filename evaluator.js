/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code that contains logic for evaluating playing decisions
*/

class decision {
    constructor(name, count) {
        this.name = name;
        this.count = count;
    }
}

const h = new decision("hit", "any")
const s = new decision("stand", "any")
const d = new decision("double", "any")

const y = new decision("split", "any")
const n = new decision("no", "any")

const y5 = new decision("split", 5);

const s5 = new decision("stand", 5)
const s0 = new decision("stand", 0)
const s4 = new decision("stand", 4)
const sm1 = new decision("stand", -1)
const sm2 = new decision("stand", -2)
const s2 = new decision("stand", 2)
const sm3 = new decision("stand", -3)

const d1 = new decision("double", 1)
const dm1 = new decision("double", -1)

const d4 = new decision("double", 4)
const d3 = new decision("double", 3)

//illustrious 18 hard hands
i18H17 = [
    //2 3  4  5  6  7  8  9  10 A
    [s, s, s, s, s, s, s, s, s, s], //17
    [s, s, s, s, s, h, h, s5, s0, h], //16
    [s, s, s, s, s, h, h, h, s4, h], //15
    [s, s, s, s, s, h, h, h, h, h], //14
    [sm1, sm2, s, s, s, h, h, h, h, h], //13
    [s4, s4, s0, sm1, sm3, h, h, h, h, h], //12
    [d, d, d, d, d, d, d, d, d, dm1], //11
    [d, d, d, d, d, d, d, d, d4, d3], //10
    [d1, d, d, d, d, d4, h, h, h, h], //9
]

i18H17.reverse()

//illustrious 18 soft hands
i18S17 = [
    //2 3  4  5  6  7  8  9  10 A
    [s, s, s, s, s, s, s, s, s, s], //17
    [s, s, s, s, s, h, h, s5, s0, h], //16
    [s, s, s, s, s, h, h, h, s4, h], //15
    [s, s, s, s, s, h, h, h, h, h], //14
    [sm1, sm2, s, s, s, h, h, h, h, h], //13
    [s4, s4, s0, sm1, sm1, h, h, h, h, h], //12
    [d, d, d, d, d, d, d, d, d, d1], //11
    [d, d, d, d, d, d, d, d, d4, d4], //10
    [d1, d, d, d, d, d4, h, h, h, h], //9
]

i18S17.reverse();

//illustrious 18 split variants
i18Split = [
    //2 3  4  5  6  7  8  9  10 A
    [y, y, y, y, y, y, y, y, y, y], //A,A
    [n, n, n, y5, y5, n, n, n, n, n], //10, 10
    [y, y, y, y, y, n, y, y, n, n], //9,9
    [y, y, y, y, y, y, y, y, y, y], //8,8
    [y, y, y, y, y, y, n, n, n, n], //7,7
    [y, y, y, y, y, n, n, n, n, n], //6,6
    [n, n, n, n, n, n, n, n, n, n], //5,5
    [n, n, n, y, y, n, n, n, n, n], //4,4
    [y, y, y, y, y, y, n, n, n, n], //3,3
    [y, y, y, y, y, y, n, n, n, n] //2,2
]

i18Split.reverse();

//basic strategy hard hand table
hardTable = [
    //2 3  4  5  6  7  8  9  10 A
    [s, s, s, s, s, s, s, s, s, s], //17
    [s, s, s, s, s, h, h, h, h, h], //16
    [s, s, s, s, s, h, h, h, h, h], //15
    [s, s, s, s, s, h, h, h, h, h], //14
    [s, s, s, s, s, h, h, h, h, h], //13
    [h, h, s, s, s, h, h, h, h, h], //12
    [d, d, d, d, d, d, d, d, d, d], //11
    [d, d, d, d, d, d, d, d, h, h], //10
    [h, d, d, d, d, h, h, h, h, h], //9
]

hardTable.reverse();

//basic strategy soft hand table
softTable = [
    //2 3  4  5  6  7  8  9  10 A
    [s, s, s, s, s, s, s, s, s, s], //soft 20
    [s, s, s, s, d, s, s, s, s, s], //soft 19
    [d, d, d, d, d, s, s, h, h, h], //soft 18
    [h, d, d, d, d, h, h, h, h, h], //soft 17
    [h, h, d, d, d, h, h, h, h, h], //soft 16
    [h, h, d, d, d, h, h, h, h, h], //soft 15
    [h, h, h, d, d, h, h, h, h, h], //soft 14
    [h, h, h, d, d, h, h, h, h, h] //soft 13
]

softTable.reverse();

//basic split decision
split = [
    //2 3  4  5  6  7  8  9  10 A
    [y, y, y, y, y, y, y, y, y, y], //A,A
    [n, n, n, n, n, n, n, n, n, n], //10, 10
    [y, y, y, y, y, n, y, y, n, n], //9,9
    [y, y, y, y, y, y, y, y, y, y], //8,8
    [y, y, y, y, y, y, n, n, n, n], //7,7
    [y, y, y, y, y, n, n, n, n, n], //6,6
    [n, n, n, n, n, n, n, n, n, n], //5,5
    [n, n, n, y, y, n, n, n, n, n], //4,4
    [y, y, y, y, y, y, n, n, n, n], //3,3
    [y, y, y, y, y, y, n, n, n, n] //2,2
]

split.reverse();

/**
 * evaluates if the move is optimal given the game state
 * @param {hand} hand hand object of player making move
 * @param {String} move string that represents move ex: "hit"
 * @param {number} count true count at that moment
 * @param {number} upcardValue value of dealers upcard
 * @param {boolean} h17 whether the dealer must hit on soft 17s
 * @returns [{Boolean} true if move is optimal, Message]
 */
function eval(hand, move, count, upcardValue, h17) {
    var handVal = hand.getValue();
    console.log(handVal);
    upcardValue -= 2;

    //case where player splits
    if (hand.canSplit()) {
        c = handVal / 2
        if (hand.value == 2) {
            return [(move === "split"), "It is always correct to split aces according to basic strategy"];
        }
        if (split[c - 2][upcardValue].name === "split") {
            return [(move === "split"), "it was correct to split that hand according to basic strategy"]
        }
        if (i18Split[c - 2][upcardValue].name === "split" && count >= i18Split[c - 2].count) {
            return [(move === "split"), "it was correct to split that hand according to the illustrious 18"]
        }
    }


    //case where hand is soft
    if (hand.isSoft()) {
        var softTableMove = softTable[handVal - 13][upcardValue].name
        if (h17) {
            var i18H17Move = i18H17[handVal - 13][upcardValue].name
            if (softTableMove !== i18H17Move) {
                if (count >= i18H17[handVal - 13][upcardValue].count) {
                    return [(move === i18H17Move), "It is was correct to " + i18H17Move + " that hand according to the illustrious 18"];
                }
            }
        } else {
            var i18S17Move = i18S17[handVal - 9][upcardValue].name
            if (softTableMove !== i18S17Move) {
                if (count >= i18H17[handVal - 9][upcardValue].count) {
                    return [(move === i18S17Move), "It was correct to " + i18S17Move + " that hand according to the illustrious 18"];
                }
            }
        }
        return [(move === softTableMove), "It was correct to " + softTableMove + " that hand according to basic strategy"];
    }

    //case where hand is hard

    if (handVal < 9) {
        return [(move === "hit"), "It is almost always correct to hit hands that are 8 or below according to basic strategy"];
    }
    if (handVal > 16) {
        return [(move === "stand"), "It is almost always correct to stand hard hands that are 17 or more according to basic strategy"];
    }
    console.log((handVal - 9) + " " + upcardValue)
    var hardTableMove = hardTable[handVal - 9][upcardValue].name
    console.log(hardTableMove);
    if (h17) {
        var i18H17Move = i18H17[handVal - 9][upcardValue].name
        if (hardTableMove !== i18H17Move) {
            if (count >= i18H17[handVal - 9][upcardValue].count) {
                return [(move === i18H17Move), "It was correct to " + i18H17Move + " that hand according to the illustrious 18"];
            }
        }
    } else {
        var i18S17Move = i18S17[handVal - 9][upcardValue].name
        if (hardTableMove !== i18S17Move) {
            if (count >= i18S17[handVal - 9][upcardValue].count) {
                return [(move === i18S17Move), "It was correct to " + i18S17Move + " that hand according to the illustrious 18"];
            }
        }
    }
    return [(move === hardTableMove), "It was correct to " + hardTableMove + " that hand according to basic strategy"];
}

module.exports = { eval };