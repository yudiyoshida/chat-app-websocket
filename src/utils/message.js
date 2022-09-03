const moment = require('moment');

const generateMessage = (who, message) => {
  return {
    who,
    message,
    createdAt: moment(new Date()).format('hh:mm a')
  };
};

module.exports = { generateMessage };