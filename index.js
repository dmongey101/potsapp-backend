const dbConfig =  require('./config/db');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;
const user = require('./routes/userRoutes');
const room = require('./routes/roomsRoutes');
const roomsController = require('./controllers/rooms/room');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user', user);
app.use('/rooms', room);

io.on("connection", socket => {
  console.log('a user connected')

  socket.on("join-room", data => {
    console.log(roomsController.rooms)
    socket.join(data.room);
    io.to(data.room).emit("player-joined", data.player);
  });
});

server.listen(port, () => console.log("server running on port:" + port));