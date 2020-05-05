const io = require('../../index').io;
const rooms = {}

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
        noOfPlayers: req.body.noOfPlayers,
        noOfTeams: req.body.noOfTeams,
        players: [player],
        pot1: [],
        pot2: [],
        teams: {}
    }

    for (var i = 1; i <= noOfTeams; i++) {
        rooms[req.body.roomName].teams[i.toString()] = [];
    }

    assignTeam(player, noOfTeams)
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
    rooms[req.body.roomName].pot1.push(req.body.word1, req.body.word2, req.body.word3, req.body.word4);

    if (rooms[req.body.roomName].pot1.length >= parseInt(rooms[req.body.roomName].noOfPlayers) * 4) {
        req.app.io.to(req.body.roomName).emit('start-game');
    } else {
        req.app.io.to(req.body.roomName).emit('player-ready', req.body.player);
    }
}

function assignTeam(player) {
    const noOfPlayers = parseInt(rooms[player.room].noOfPlayers);
    const noOfTeams = parseInt(rooms[player.room].noOfTeams);

    for (var i = 1; i <= noOfPlayers; i++) {
        if (rooms[player.room].teams[i.toString()].length < Math.floor((noOfPlayers/noOfTeams))) {
            rooms[player.room].teams[i.toString()].push(player);
            break;
        }
    }
}

exports.rooms = rooms