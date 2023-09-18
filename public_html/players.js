/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code that is used for players.html. Displays the lobby and updates
    the list of players in the lobby. If the game is started by the host a request
    is sent to the server.
*/

const playerList = document.getElementById('playerList');
const gameId = document.getElementById('gameId');
const startGameButton = document.getElementById('startGame');

/*
    Used for the start game button. Sends a request to the server to start
    the game.
*/
function startGame() {
    fetch('/start/game');
}

/*
    Updates the list of players who are currently in a lobby. If any new players
    join the list will be updated to reflect any new players.
*/
function update() {
    fetch('/get/lobby').then((response) => {
        return response.json();
    }).then((players) => {
        playerList.innerText = "PLAYERS:\n" + players.join(", ");
        if (players[0] === getUsernameFromCookie()) {
            startGameButton.style.display = "inline-block";
        } else {
            startGameButton.style.display = "none";
        }
    })
    fetch('/get/inGame').then((response) => {
        return response.text();
    }).then((state) => {
        if (state.includes('true')) {
            console.log('Joined live game');
            window.location.href = '/game.html';
        }
    })
}

/*
    Gets the username from the cookie so it can be displayed.
*/
function getUsernameFromCookie() {
    var c = document.cookie
    c = c.substring(33);
    c = c.replace(/%.*/, '');
    return c;
}

// gets the game id when the page loads
fetch('/get/gameId').then((response) => {
    return response.text();
}).then((id) => {
    gameId.innerText = "GAME ID: " + id;
});

startGameButton.addEventListener("click", startGame);
setInterval(update, 1000);
