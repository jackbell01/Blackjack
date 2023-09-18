/*
    Name: Desmond Goodman-Ahearn, Katelen Tellez, Jack Bell
    Final Project:  BlackJack
    Purpose: Create server for blackjack game. GET requests handled to get saved
    data and display it, and to handle requests for the logic of the game. 
    POST requests handled to save users and game settings.
*/
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { time } = require('console');
const game = require('./game');

// connect to database
const connection_string = 'mongodb://127.0.0.1/blackjack'
mongoose.connect(connection_string, { useNewURLParser: true });
mongoose.connection.on('error', () => {
    console.log('Connection error');
});

// create user schema for database
var UserSchema = mongoose.Schema({
    username: String,
    salt: Number,
    hash: String,
    gameSettings: [],
    profilePic: String,
    gameStats: []
});
var User = mongoose.model('User', UserSchema);

// creates game settings schema for database
var GameSettingsSchema = mongoose.Schema({
    maxPlayers: Number,
    numDecks: Number,
    maxBet: Number,
    minBet: Number,
    startMoney: Number,
    shuffleAt: Number,
    insurance: Number,
    blackjackPay: Number,
    h17: Boolean,
    feedback: Boolean
});
var GameSettings = mongoose.model('GameSettings', GameSettingsSchema);

// create user schema for database
var GameStatsSchema = mongoose.Schema({
    gamesPlayed: Number,
    amountWon: Number,
    amountLost: Number,
    totalProfit: Number,
    correctMoves: Number,
    mistakes: Number
});
var GameStats = mongoose.model('GameStats', GameStatsSchema);

let sessions = {};

/*
  This function adds a user to the current sessions. A session id is assigned
  to the user and their start time for their session is saved.
  The parameter user is the username of the user being added to sessions.
*/
function addUpdateSession(user) {
    let sessionStart = Date.now();
    if (sessions[user] != undefined) {
        //console.log("update session");
        sessions[user].start = sessionStart;
        return sessions[user].sid;
    }
    let sessionId = Math.floor(Math.random() * 100000);
    sessions[user] = { 'sid': sessionId, 'start': sessionStart, 'curGameId': 0, 'inGame': false };
    return sessionId;
}

/*
  This function is used to verify if a user has a session.
  The user parameter is the username of the user. The sessionId 
  parameter is the id that should match with the username if the
  user has a session.
*/
function doesUserHaveSession(user, sessionId) {
    let entry = sessions[user];
    if (entry != undefined) {
        return entry.sid == sessionId;
    }
    return false;
}

const SESSION_LENGTH = 600000;
/*
  This function is used to cleanup sessions that have expired. Any user sessions that
  have gone past their expiry time are removed from sessions.
*/
function cleanupSessions() {
    let currentTime = Date.now();
    for (i in sessions) {
        let sess = sessions[i];
        if (sess.inGame) {
            let gameId = sessions[i].curGameId;
            let curGame = games[gameId];
            if (curGame.isInactive(i)) {
                console.log(i + " is inactive")
                let retVal = curGame.removePlayer(i);
                sendStats(i, retVal);
                if (curGame.playerCount() == 0) {
                    delete games[gameId];
                    console.log("game#" + gameId + " has no players and is ended");
                }
                delete sessions[i];
            }
        }
        if (sess.start + SESSION_LENGTH < currentTime) {


            //console.log('removing session for user: ' + i);
            delete sessions[i];
        }
    }
}
setInterval(cleanupSessions, 2000);

/*
  This function authenticates the user and checks if the user is logged in. If the user
  is not logged in then they are redirected to the login page.
*/
function authenticate(req, res, next) {
    let c = req.cookies;
    if (c && c.login) {
        let result = doesUserHaveSession(c.login.username, c.login.sid);
        if (result) {
            //console.log("authenticate");
            res.cookie("login", { username: c.login.username, sid: c.login.sid }, { maxAge: SESSION_LENGTH });
            addUpdateSession(c.login.username);
            next();
            return;
        }
    }
    res.redirect('/index.html');
}

const games = {};
const lobbies = {};

function createLobbie(username) {
    let gameSessionId = Math.floor(Math.random() * 100000);
    lobbies[gameSessionId] = [];
    lobbies[gameSessionId].push(username);
    return gameSessionId;
}

function startGame(gameSessionId, gameSettings) {
    let players = lobbies[gameSessionId];
    games[gameSessionId] = new game(gameSettings, players);
    for (var i = 0; i < players.length; i++) {
        u = players[i];
        sessions[u].inGame = true;
    }
}

const app = express();

app.use(cookieParser());
app.use('/home.html', authenticate);
app.use('/game.html', authenticate);
app.use('/tutorial.html', authenticate);
app.use('/help.html', authenticate);
app.use('/settings.html', authenticate);
app.use('/play.html', authenticate);
app.use('/joinGame.html', authenticate);
app.use('/players.html', authenticate);
app.use('/profile.html', authenticate);
app.use('/stats.html', authenticate);
app.use(express.static('public_html'));
app.use(express.static('game'));
app.use(express.json());

// get the users
app.get('/get/users/', (req, res) => {
    let p1 = User.find().exec();
    p1.then((results) => {
        res.end(JSON.stringify(results));
    });
    p1.catch((err) => {
        console.log(err);
        res.end('Failed to get users');
    });
});

// save user photo
app.get('/save/picture/:imgSrc', (req, res) => {
    let p1 = User.find({ username: req.cookies.login.username }).exec();
    p1.then((results) => {
        results[0].profilePic = req.params.imgSrc;
        results[0].save();
        res.end('SUCCESS');
    });
    p1.catch((error) => {
        res.end('Failed to find username');
    });
});

// change user photo
app.get('/change/picture/', (req, res) => {
    let p1 = User.find({ username: req.cookies.login.username }).exec();
    p1.then((results) => {
        let imgSrc = results[0].profilePic;
        res.end(imgSrc);
    });
    p1.catch((error) => {
        res.end('Failed to find username');
    });
});

// get user stats
app.get('/get/stats/', (req, res) => {
    let p1 = User.find({ username: req.cookies.login.username }).exec();
    p1.then((results) => {
        let p2 = GameStats.find({ _id: results[0].gameStats }).exec();
        p2.then((results) => {
            res.end(JSON.stringify(results));
        });
        p2.catch((err) => {
            res.end('Failed to get game stats');
        });
    });
    p1.catch((err) => {
        res.end('Failed to find that user');
    });
});

// get the user's old settings
app.get('/get/gameSettings/', (req, res) => {
    let p1 = User.find({ username: req.cookies.login.username }).exec();
    p1.then((results) => {
        let p2 = GameSettings.find({ _id: results[0].gameSettings }).exec();
        p2.then((results) => {
            res.end(JSON.stringify(results));
        });
        p2.catch((err) => {
            res.end('Failed to get game settings');
        });
    });
    p1.catch((err) => {
        res.end('Failed to find that user');
    });
});

// save user to database
app.post('/create/user/', (req, res) => {
    let data = req.body;
    if (data.username.length == 0 || data.password.length == 0) {
        res.end("Fill out both fields.");
        return;
    }
    if (!(/\w$/).test(data.username)) {
        res.end("Only letters, numbers, and underscores are allowed.");
        return;
    }
    let p1 = User.find({ username: data.username }).exec();
    p1.then((results) => {
        if (results.length > 0) {
            res.end('That username is already taken');
        }
        else {
            let newSalt = Math.floor(Math.random() * 10000000);
            let toHash = data.password + newSalt;
            var hash = crypto.createHash('sha3-256');
            let hashData = hash.update(toHash, 'utf-8');
            let newHash = hashData.digest('hex');

            var newStats = new GameStats({
                gamesPlayed: 0,
                amountWon: 0,
                amountLost: 0,
                totalProfit: 0,
                correctMoves: 0,
                mistakes: 0
            });

            newStats.save().then((doc) => {
                var newUser = new User({
                    username: data.username,
                    salt: newSalt,
                    hash: newHash,
                    profilePic: 'img/default_profile.png',
                    gameStats: newStats._id
                });

                newUser.save().then((doc) => {
                    res.end('Saved user');
                }).catch((err) => {
                    console.log(err);
                    res.end('Failed to create user');
                });
            }).catch((err) => {
                console.log(err);
                res.end('Failed to create user');
            });
        }
    });
    p1.catch((err) => {
        console.log(err);
        res.end('Failed to find user');
    });

});

// login user
app.get('/login/:username/:password', (req, res) => {
    let u = req.params.username;
    let p = req.params.password;
    let p1 = User.find({ username: u }).exec();
    p1.then((results) => {
        if (results.length == 1) {
            let salt = results[0].salt;
            let toHash = req.params.password + salt;
            var hash = crypto.createHash('sha3-256');
            let data = hash.update(toHash, 'utf-8');
            let newHash = data.digest('hex');

            if (newHash == results[0].hash) {
                let id = addUpdateSession(u);
                res.cookie("login", { username: u, sid: id }, { maxAge: SESSION_LENGTH });
                res.end('SUCCESS');
            }
            else {
                res.end('login failed');
            }
        }
        else {
            res.end('login failed');
        }

    });
    p1.catch((error) => {
        res.end('login failed');
    });
});

// change settings
app.post('/create/lobby/', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let p1 = User.find({ username: u }).exec();
    p1.then((results) => {
        let data = req.body;
        var newSettings = new GameSettings({
            maxPlayers: data.maxPlayers,
            numDecks: data.numDecks,
            maxBet: data.maxBet,
            minBet: data.minBet,
            startMoney: data.startMoney,
            shuffleAt: data.shuffleAt,
            insurance: data.insurance,
            blackjackPay: data.blackjackPay,
            h17: data.h17,
            feedback: data.feedback
        });
        if (results[0].gameSettings.length > 0) {
            let p1 = GameSettings.deleteOne({ _id: results[0].gameSettings[0] }).exec();
            p1.then((results) => {
            });
            p1.catch((error) => {
                res.end('Failed to delete');
            });
        }
        results[0].gameSettings[0] = newSettings._id;
        results[0].save();

        newSettings.save().then((doc) => {
            sessions[u].curGameId = createLobbie(u);
            res.end('Created new settings');
        }).catch((err) => {
            res.end('Failed to create new settings')
        });
    });
    p1.catch((error) => {
        res.end('Failed to find username');
    });
});

app.get('/join/lobby/:gameID', authenticate, (req, res) => {
    let u = req.cookies.login.username
    let p1 = User.find({ username: u }).exec();
    let gameId = req.params.gameID;
    p1.then((results) => {
        if (!(gameId in lobbies) || gameId in games) {
            console.log("invalid game session Id");
            res.status = 400;
            res.end("invalid game session");
            return;
        }
        if (sessions[u].curGameId in games) {
            games[sessions[u].curGameId].removePlayer(u);
        }
        // check if user is already in lobby
        if (lobbies[gameId].includes(u)) {
            res.end('User already in lobby. Cannot join.');
            return;
        }
        else {
            lobbies[gameId].push(u);
            sessions[u].curGameId = gameId;
            res.status = 200;
            res.end('Joined game: ' + gameId);
        }
    })
    p1.catch((error) => {
        res.status = 400;
        res.end('Failed to find username');
    });
});



app.get('/start/game', authenticate, (req, res) => {
    let u = req.cookies.login.username
    let p1 = User.find({ username: u }).exec();
    p1.then((players) => {
        let gameId = sessions[u].curGameId;
        console.log(gameId);
        if (!(gameId in lobbies)) {
            res.status = 400;
            res.end("can't start game because no lobby was found");
            return;
        }
        if (lobbies[gameId][0] !== u) {
            res.status = 400;
            res.end("can't start game because user is not the host");
            return;
        }
        let gameSettings = GameSettings.findById(players[0].gameSettings[0]);
        gameSettings.then((results) => {
            console.log(results);
            startGame(gameId, results);
            res.status = 200;
            res.end('game has started');
        });
    });
})

app.get('/start/practice/', authenticate, (req, res) => {
    let u = req.cookies.login.username
    var defaultSettings = {
        maxPlayers: 4,
        numDecks: 6,
        maxBet: 50,
        minBet: 1,
        startMoney: 100,
        shuffleAt: 78,
        insurance: 2,
        blackjackPay: 1.5,
        h17: true,
        feedback: true
    }

    sessions[u].curGameId = createLobbie(u);
    console.log(sessions[u])
    startGame(sessions[u].curGameId, defaultSettings);
    res.status = 200;
    res.end('game has started');

})

app.get('/get/lobby', authenticate, (req, res) => {
    let u = req.cookies.login.username
    let gameId = sessions[u].curGameId;
    res.end(JSON.stringify(lobbies[gameId]));
});

app.get('/get/gameId', authenticate, (req, res) => {
    let u = req.cookies.login.username
    let gameId = sessions[u].curGameId;
    res.end(gameId.toString());
});

app.get('/get/isHost', authenticate, (req, res) => {
    let u = req.cookies.login.username
    let gameId = sessions[u].curGameId;
    if (lobbies[gameId][0] === u) {
        res.end("true");
    }
    else {
        res.end("false")
    }
})

app.get('/get/inGame', authenticate, (req, res) => {
    let u = req.cookies.login.username
    if (sessions[u].inGame) {
        res.end("true");
    }
    else {
        res.end("false")
    }
});

/*
    This function saves the stats to the database after a player has left the game. Once the
    player leaves the game their stats are properly saved to their stats.
*/
function sendStats(u, amounts) {
    let p1 = User.find({ username: u }).exec();
    p1.then((results) => {
        let p2 = GameStats.find({ _id: results[0].gameStats }).exec();
        p2.then((results2) => {
            let lost = amounts[0];
            let won = amounts[1];
            let correct = amounts[2];
            let mistakes = amounts[3];
            results2[0].gamesPlayed += 1;
            results2[0].amountLost += lost;
            results2[0].amountWon += won;
            results2[0].totalProfit = results2[0].amountWon - results2[0].amountLost;
            results2[0].correctMoves += correct;
            results2[0].mistakes += mistakes;
            results2[0].save();
            console.log('Saved stats');
        });
        p2.catch((err) => {
            console.log('Failed to get game stats');
        });
    });
    p1.catch((err) => {
        console.log('Failed to find that user');
    });
}

//game logic stuff
app.get('/game/leave', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    let retVal = curGame.removePlayer(u);
    sendStats(u, retVal);
    sessions[u].inGame = false;
    sessions[u].curGameId = 0;
    if (curGame.playerCount() == 0) {
        delete games[gameId];
        console.log("game#" + gameId + " has no players and is ended");
    }
    res.end("Left game");
})

app.get('/game/getConfig', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.getGameConfig());
});

app.get('/game/getState', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    try {
        res.end(curGame.getGameState(u));
    } catch {
        res.end("can't get game state");
    }

})

app.get('/game/stand', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.stand(u));
})

app.get('/game/hit', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.hit(u));
})

app.get('/game/double', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.double(u));
})

app.get('/game/split', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.split(u));
})

app.get('/game/placeBet/:bet', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.setBet(u, req.params.bet));
})

app.get('/game/placeInsuranceBet/:bet', authenticate, (req, res) => {
    let u = req.cookies.login.username;
    let gameId = sessions[u].curGameId;
    let curGame = games[gameId];
    res.end(curGame.setInsuranceBet(u, req.params.bet));
})

const port = 80;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
});

//fgsdfgsdfgh