const rooms = {}

exports.getRooms = (req, res) => {
    var roomNames = [];
    for(var room in rooms) roomNames.push(room);
    res.send(roomNames);
}

exports.getPlayers = (req, res) => {
    var players = [];
    console.log(rooms[req.params.room].players)
    rooms[req.params.room].players.forEach(player => {
        players.push(player.name)
    })
    console.log(players)
    res.send(players);
}

exports.createRoom = (req, res) => {

    const player = {
        name: req.body.playerName,
        team: req.body.team,
        room: req.body.roomName
    }

    rooms[req.body.roomName] = {
        noOfPlayers: req.body.noOfPlayers,
        noOfTeams: req.body.noOfTeams,
        players: [player],
        pot: [],
        pot2: []
    }
}

exports.joinRoom = (req, res) => {
    var team = Math.floor(Math.random() * parseInt(rooms[req.body.roomName].noOfPlayers))
    const player = {
        name: req.body.playerName,
        team: team,
        room: req.body.roomName
    }
    rooms[req.body.roomName].players.push(player)
}

console.log(rooms)


exports.rooms = rooms