const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
    name: {type: String, required: true, max: 50},
    noOfPlayers: {type: Number, required: true},
    currentPlayer: {type: String, required: true},
    currentPosition: {type: Number, required: true, default: 1},
    currentTeam: {type: Number, required: true, default: 1},
    currentRound: {type: String, required: true, default: 'Articulate'},
    scores: {type: Array, required: true, default: []},
    totalScore: {type: Number, required: true, default: 0},
    pot1: {type: Array, required: true},
    pot2: {type: Array, required: true, default: []},
    teams: {type: Object, required: true}
})

module.exports = mongoose.model('Room', RoomSchema);