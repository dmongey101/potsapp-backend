const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
    name: {type: String, required: true, max: 50},
    noOfPlayers: {type: Number, required: true},
    currentPlayer: {type: Number, required: true, default: 1},
    currentRound: {type: String, required: true, default: 'Articulate'},
    redTeamScore: {type: Number, required: true, default: 0},
    blueTeamScore: {type: Number, required: true, default: 0},
    players: {type: Array, required: true},
    pot1: {type: Array, required: true},
    pot2: {type: Array, required: true}
})

module.exports = mongoose.model('Room', RoomSchema);