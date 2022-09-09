const moment = require('moment');

const generateData = (username, message) => {
  return {
    username,
    message,
    createdAt: moment(new Date()).format('hh:mm a')
  };
};

module.exports = { generateData };