const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { generateMessage } = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

io.on('connection', (socket) => {

  socket.on('message', (who, message, callback) => {
    io.emit('message', generateMessage(who, message));
    callback();
  });

  socket.on('location', (who, location, callback) => {
    io.emit('location', generateMessage(who, location));
    callback();
  });

  // socket.emit, io.emit, socket.broadcast.emit
  // io.to.emit, socket.broadcast.to.emit
  socket.on('join', ({ username, room }) => {
    socket.join(room);
    
    socket.emit('message', generateMessage('socket.io', 'Welcome!'));
    socket.broadcast.to(room).emit('message', generateMessage('socket.io', `${username} has joined!`));
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('socket.io', `${socket.id} disconnected`));
  });
});

server.listen(3000, () => {
  console.log('OK');
});
