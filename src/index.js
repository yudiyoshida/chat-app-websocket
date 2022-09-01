const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));


io.on('connection', (socket) => {
  socket.broadcast.emit('message', 'socket.io', `${socket.id} joined the room!`, '');
  socket.emit('message', 'socket.io', 'Welcome!');

  socket.on('message', (who, message, callback) => {
    io.emit('message', who, message);
    callback();
    
  });

  socket.on('location', (who, location, callback) => {
    io.emit('location', who, location);
    callback();
    
  });

  socket.on('disconnect', () => {
    io.emit('message', 'socket.io', `${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('OK');
});
