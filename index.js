const dbConfig =  require('./config/db');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = process.env.PORT || 3000
const user = require('./routes/userRoutes');
const room = require('./routes/roomsRoutes');

app.set('socketio', io);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user', user);
app.use('/rooms', room);

app.get('/', (req, res) => {
  res.send('Working');
})

io.on("connection", socket => {
  console.log('a user connected')

  socket.on("join-room", data => {
    socket.join(data.room);
    io.to(data.room).emit("player-joined", data.player);
  });

  socket.on("start-timer", room => {
    var counter = 5;
    var RoundTimer = setInterval(() => {
      io.in(room.room).emit('counter', counter);
      counter --;
      if (counter === -1) {
        clearInterval(RoundTimer);
      }
    }, 1000);
  })

  socket.on('next-round', room => {
    changeGameState(room);
    io.in(room.name).emit('new-game-state', room);
  })

  socket.on('inc-score', data => {
    var currentRound = 'Articulate';
    if (data.totalScore >= (data.noOfPlayers * 4) - 1) currentRound = 'Charades';
    if (data.totalScore >= (data.noOfPlayers * 8) - 1) currentRound = 'One Word';
    if (data.totalScore >= (data.noOfPlayers * 12) - 1) currentRound = 'One Action';
    if (data.totalScore >= (data.noOfPlayers * 16) - 1) currentRound = 'Game Over';
    io.in(data.room).emit('updated-score', {currentTeam: data.currentTeam, currentRound: currentRound, score: data.score, totalScore: data.totalScore})
  })

});

function changeGameState(room) {
  
  var i = room.currentTeam;

  room.teams[i.toString()].currentPlayer < room.teams[i.toString()].players.length ? room.teams[i.toString()].currentPlayer ++ : room.teams[i.toString()].currentPlayer = 1;

  room.currentTeam < room.scores.length ? room.currentTeam ++ : room.currentTeam = 1;

  var nextPlayer = room.teams[room.currentTeam.toString()].players.find(x => x.position == room.teams[room.currentTeam.toString()].currentPlayer);

  room.currentPlayer = nextPlayer.player;

  return room;
}

server.listen(port, () => console.log("server running on port:" + port));
