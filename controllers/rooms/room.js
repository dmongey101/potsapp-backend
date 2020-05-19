const io = require('../../index').io;
const Room = require('../../models/room');
const User = require('../../models/user')
const rooms = {};

exports.getRooms = (req, res) => {
    var roomNames = [];
    for(var room in rooms) roomNames.push(room);
    res.send(roomNames);
}

exports.getPlayers = (req, res) => {
    var players = [];
    rooms[req.params.room].players.forEach(player => {
        players.push(player.name)
    })
    res.send(players);
}

exports.createRoom = (req, res) => {

    const player = {
        name: req.body.playerName,
        room: req.body.roomName
    }

    const noOfTeams = parseInt(req.body.noOfTeams);

    rooms[req.body.roomName] = {
        room: req.body.roomName,
        noOfPlayers: req.body.noOfPlayers,
        noOfTeams: req.body.noOfTeams,
        currentPlayer: req.body.playerName,
        players: [player],
        scores: [],
        pot1: [],
        pot2: [],
        teams: {}
    }

    for (var i = 1; i <= noOfTeams; i++) {
        var team = i.toString();
        rooms[req.body.roomName].scores.push({ [team]: 0 });
        rooms[req.body.roomName].teams[team] = { currentPlayer: 1, players: [] };
    }

    assignTeam(player)
}

exports.joinRoom = (req, res) => {

    const player = {
        name: req.body.playerName,
        room: req.body.roomName
    }
    rooms[req.body.roomName].players.push(player);
    assignTeam(player);
}

exports.submitWords = (req, res) => {
    var io = req.app.get('socketio');

    rooms[req.body.roomName].pot1.push(req.body.word1, req.body.word2, req.body.word3, req.body.word4);

    if (rooms[req.body.roomName].pot1.length >= parseInt(rooms[req.body.roomName].noOfPlayers) * 4) {

        var teams = assignPlayerPositions(rooms[req.body.roomName].teams);

        let roomToSave = new Room({
            name: req.body.roomName,
            noOfPlayers: parseInt(rooms[req.body.roomName].noOfPlayers),
            currentPlayer: rooms[req.body.roomName].currentPlayer,
            pot1: rooms[req.body.roomName].pot1,
            scores: rooms[req.body.roomName].scores,
            teams: teams
        })

        roomToSave.save()
            .then(room => {
                console.log(req.body.roomName+ ' saved in database')
            })
            .catch(err => {
                console.log(err)
            })

        io.to(req.body.roomName).emit('start-game');

    } else {
        io.to(req.body.roomName).emit('player-ready', req.body.player);
    }
}

exports.getCurrentRoom = (req, res) => {
    Room.findOne({ name: req.params.room }, function(err, room) {
        if (room == null) res.send(err);
        else res.send(room);
    });
}

function assignTeam(player) {
    const noOfPlayers = parseInt(rooms[player.room].noOfPlayers);
    const noOfTeams = parseInt(rooms[player.room].noOfTeams);
    User.findOne({ email: player.name }, function(err, user) {
        if (user == null) console.log(err);
        else {
            for (var i = 1; i <= noOfPlayers; i++) {
                if (rooms[player.room].teams[i.toString()].players.length < Math.floor((noOfPlayers/noOfTeams))) {
                    rooms[player.room].teams[i.toString()].players.push({ player: user.username, playerEmail: player.name, position: 0 });
                    break;
                }
            }
        }
    })

}

function assignPlayerPositions(teams) {
    Object.keys(teams).forEach(team => {
        var i = 1;
        teams[team].players.forEach(player => {
            player.position = i;
        }); 
    });
    return teams;
}

exports.rooms = rooms