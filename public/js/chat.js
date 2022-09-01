/* eslint-disable no-undef */
const socket = io();

const form = window.document.querySelector('form');

socket.on('message', (who, message) => {
  console.log(`Sent by: ${who} | ${message}`);
});

// socket.on('location', (location) => {
//   console.log(location);
// });

window.document.querySelector('form button#sendmsg').addEventListener('click', (e) => {
  e.preventDefault();

  const input = form.querySelector('input#msg');
  if (input.value) {
    socket.emit('message', socket.id, input.value);
    
  }
  input.value = '';

});

window.document.querySelector('button#location').addEventListener('click', (e) => {
  e.preventDefault();

  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');
  
  navigator.geolocation.getCurrentPosition((position) => {
    const BASE_URL = 'https://google.com/maps?q=';
    const infos = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      // timestamp: position.timestamp,
    };

    socket.emit('message', socket.id, `${BASE_URL}${infos.latitude},${infos.longitude}`);
  });

});
