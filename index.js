const dbConfig =  require('./config/db');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = process.env.PORT || 3000
const user = require('./routes/userRoutes');
const room = require('./routes/roomsRoutes');

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
    console.log(data)
    io.to(data.room).emit("player-joined", data.player);
  });
});

server.listen(port, () => console.log("server running on port:" + port));