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
    console.log('dd')
    io.to(data.room).emit("player-joined", data.player);
  });

  socket.on("start-timer", room => {
    var counter = 5;
    console.log('hi')
    var RoundTimer = setInterval(() => {
      io.to(room).emit('counter', counter);
      if (counter === -1) {
        clearInterval(RoundTimer);
      }
    }, 1000);
  })
});

server.listen(port, () => console.log("server running on port:" + port));
