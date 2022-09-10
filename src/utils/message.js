const moment = require('moment');

const generateData = (username, message) => {
  return {
    username,
    message,
    createdAt: moment(new Date()).format('hh:mm a')
  };
};

const generateRoom = (room, users) => {
  return {
    room,
    users,
  };
};

module.exports = { generateData, generateRoom };