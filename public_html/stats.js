/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Code for displaying the stats of the user. Uses get request
    to retrieve the stats from the server.
*/

function getStats() {
  let url = '/get/stats/';
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.json();
  }).then((object) => {
    console.log('Stats retrieved');
    document.getElementById('gamesPlayed').innerText = "Games Played: " + object[0].gamesPlayed;
    document.getElementById('amountWon').innerText = "Money Won: " + object[0].amountWon;
    document.getElementById('amountLost').innerText = "Money Lost: " + object[0].amountLost;
    document.getElementById('totalProfits').innerText = "Total Profits: " + object[0].totalProfit;
    document.getElementById('correctMoves').innerText = "Correct Moves: " + object[0].correctMoves;
    document.getElementById('mistakes').innerText = "Bad Moves: " + object[0].mistakes;
  }).catch(() => {
    alert('Could not get stats');
  });
}
getStats();