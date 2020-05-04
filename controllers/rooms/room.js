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
        pot: [],
        pot2: [],
        teams: {}
    }

    for (var i = 1; i <= noOfTeams; i++) {
        rooms[req.body.roomName].teams[i.toString()] = [];
    }

    assignTeam(player, noOfTeams)

    console.log(rooms);
}

exports.joinRoom = (req, res) => {

    const player = {
        name: req.body.playerName,
        room: req.body.roomName
    }
    rooms[req.body.roomName].players.push(player);

    assignTeam(player);
}

function assignTeam(player) {
    const noOfPlayers = parseInt(rooms[player.room].noOfPlayers);
    const noOfTeams = parseInt(rooms[player.room].noOfTeams);

    for (var i = 1; i <= noOfPlayers; i++) {
        if (rooms[player.room].teams[i.toString()].length <= (noOfPlayers/noOfTeams)) {
            rooms[player.room].teams[i.toString()].push(player);
            break;
        }
    }
}

exports.rooms = rooms