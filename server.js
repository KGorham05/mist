require('dotenv').config();
const http = require('http');
const unsetupIO = require('socket.io');
const app = require('./routes');
const gameLogic = require('./game_logic');

const PORT = process.env.PORT || 3001;
const server = http.Server(app);
const io = unsetupIO(server);

gameLogic(io);

// When Chat recieves a new message, it forwards it to all clients
io.on('connection', function (socket) {
  socket.on('new message', (data) => {
    io.emit('new message', data);
  });
});

server.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
