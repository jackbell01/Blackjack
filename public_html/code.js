/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Client-side js used for sending information for users and game settings. Used to create user,
    login as user, creat game settings, and joining a game through GET and POST requests.
*/

/*
    This function is used to create a user when the create user button is clicked. 
    A POST request is used to send the username and password to the server for 
    saving into the database.
*/
function createUser() {
  let loginError = document.getElementById('loginErr');
  loginError.innerText = '';
  let createError = document.getElementById('createErr');
  createError.innerText = '';

  let u = document.getElementById('username').value;
  let pw = document.getElementById('password').value;
  let url = '/create/user/';
  let data = { username: u, password: pw };
  let p = fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
    if (text == 'Saved user') {
      alert('User created');
    }
    else {
      let x = document.getElementById('createErr');
      x.innerText = text;
    }
  }).catch(() => {
    alert('Failed to create user');
  });
}

/*
  This function is used to login a user when the login button is clicked. 
  A POST request is used to send the username and password to the server for 
  verifying that the user's name and password are valid.
*/
function loginUser() {
  let loginError = document.getElementById('loginErr');
  loginError.innerText = '';
  let createError = document.getElementById('createErr');
  createError.innerText = '';

  let u = document.getElementById('usernameLogin').value;
  let pw = document.getElementById('passwordLogin').value;
  let url = '/login/' + u + '/' + pw;
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
    if (text == 'SUCCESS') {
      console.log('Login success');
      window.location.href = '/home.html';
    }
    else {
      let x = document.getElementById('loginErr');
      x.innerText = "Login failed";
    }

  }).catch(() => {
    alert('Failed to login');
  });
}

/*
  This function is used to change the game settings based on user input.
  A POST request is used to send infomration for the settings to the server for 
  saving into the database.
*/
function setupGameSettings() {
  let numP = document.getElementById('numPlayers').value;
  let d = document.getElementById('numDecks').value;
  let max = document.getElementById('maxBet').value;
  let min = document.getElementById('minBet').value;
  let s = document.getElementById('startMoney').value;
  let sa = document.getElementById('shuffleAt').value;
  let i = document.getElementById('insurance').value;
  let bp = document.getElementById('blackjackPay').value;
  let h = document.getElementById('h17').checked;
  let f = document.getElementById('feedback').checked;

  // make sure all fields are filled in
  if (numP == '' || d == '' || max == '' || min == '' || s == '' || sa == '' || i == '' || bp == '') {
    console.log("Settings not changed");
    alert('Please fill in all of the fields');
  }

  else if (numP > 4 || numP < 1) {
    console.log("Settings not changed");
    alert('Number of players must be 1-4');
  }

  // make sure all inputs are valid
  else if (d < 1 || max < 1 || min < 1 || s < 1 || sa < 1 || i < 1 || bp < 1) {
    console.log("Settings not changed");
    alert('Please fill in the fields with numbers greater than 0');
  }

  else if (max < min) {
    console.log("Settings not changed");
    alert('Max bet must be larger than or equal to minimum bet');
  }

  else {
    let url = '/create/lobby/';
    let data = { maxPlayers: numP, numDecks: d, maxBet: max, minBet: min, startMoney: s, shuffleAt: sa, 
      insurance: i, blackjackPay: bp, h17: h, feedback: f};
    let p = fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    p.then(() => {
      console.log('Settings changed');
      window.location.href = '/players.html';
    });
    p.catch(() => {
      alert('Failed to change settings');
    });
  }
}

/*
  This function is used to change the game settings based on previous settings that
  the user last used. A get request is used to retrieve information for the settings 
  and then to fill in the input fields with their corresponding values.
*/
function fillPreviousSettings() {
  let url = '/get/gameSettings/';
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.json();
  }).then((objects) => {
    document.getElementById('numPlayers').value = objects[0].maxPlayers;
    document.getElementById('numDecks').value = objects[0].numDecks;
    document.getElementById('maxBet').value = objects[0].maxBet;
    document.getElementById('minBet').value = objects[0].minBet;
    document.getElementById('startMoney').value = objects[0].startMoney;
    document.getElementById('shuffleAt').value = objects[0].shuffleAt;
    document.getElementById('insurance').value = objects[0].insurance;
    document.getElementById('blackjackPay').value = objects[0].blackjackPay;
    document.getElementById('h17').checked = objects[0].h17;
    document.getElementById('feedback').checked = objects[0].feedback;;

  }).catch(() => {
    fillDefaultSettings();
    alert('Failed to find previous game settings. Using default values instead.');
  });
}

/*
  This function is used to change the game settings based on default settings.
  The input fields are retrieved and automatically filled in with the default values.
*/
function fillDefaultSettings() {
  document.getElementById('numPlayers').value = 4;
  document.getElementById('numDecks').value = 6;
  document.getElementById('maxBet').value = 50;
  document.getElementById('minBet').value = 1;
  document.getElementById('startMoney').value = 100;
  document.getElementById('shuffleAt').value = 78;
  document.getElementById('insurance').value = 2;
  document.getElementById('blackjackPay').value = 1.5;
  document.getElementById('h17').checked = true;
  document.getElementById('feedback').checked = false;
}

/*
  This function is used to join a game given the session ID that the user inputted.
  A get request is used to retrieve the session and verify that the session ID that
  was entered matches an open lobby. If the session ID works, the player will join the
  lobby. If the ID is found to be not valid, the user will have to try again.
*/
function joinGame() {
  let gameId = document.getElementById('sessionId').value;
  let url = '/join/lobby/' + gameId;
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
    if (text.includes('Joined game')) {
      console.log('Joined game');
      window.location.href = '/players.html';
    }
    else if(text == 'User already in lobby. Cannot join.') {
      alert('User already in lobby. Cannot join.');
    }
    else {
      alert('Invalid Session ID');
    }

  }).catch(() => {
    alert('Failed to join game');
  });
}

/*
  This function is used to start a practice game. A get request is sent
  to the server and the game begins.
*/
function startPractice() {
  let url = '/start/practice/';
  let p = fetch(url);
  let ps = p.then((response) => {
    return response.text();
  }).then((text) => {
      window.location.href = '/game.html';
  }).catch(() => {
    alert('Failed to join game');
  });
}

/*
  Gets the username from the cookie to display.
*/
function getUsername() {
  var c = document.cookie
  c = c.substring(33);
  c = c.replace(/%.*/, '');
  return c;
}

if(window.location.href.match('/home.html') != null) {
  let name = getUsername();
  document.getElementById('username').innerText = name;
}

