const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { generateData } = require('./utils/message');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

io.on('connection', (socket) => {

  // socket.emit, io.emit, socket.broadcast.emit
  // io.to.emit, socket.broadcast.to.emit
  socket.on('join', (data, callback) => {
    const { error, user } = addUser({ 
      id: socket.id, 
      username: data.username, 
      room: data.room
    });

    if (error) {
      callback(error);

    } else { 
      socket.join(user.room);
      socket.emit('message', generateData('socket.io', 'Welcome!'));
      socket.broadcast.to(user.room).emit('message', generateData('socket.io', `${user.username} has joined!`));
      callback();

    }
  });

  socket.on('message', (data, callback) => {
    io.emit('message', generateData(data.username, data.message));
    callback();
  });

  socket.on('location', (data, callback) => {
    io.emit('location', generateData(data.username, data.message));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) io.to(user.room).emit('message', generateData('socket.io', `${user.username} disconnected`));
  });

});

server.listen(3000, () => {
  console.log('OK');
});
