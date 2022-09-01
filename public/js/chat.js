/* eslint-disable no-undef */
const socket = io();

const $form = window.document.querySelector('form');
const $btnMessage = $form.querySelector('form button#sendmsg');
const $btnLocation = window.document.querySelector('button#location');

socket.on('message', (who, message) => {
  console.log(`Sent by: ${who} | ${message}`);
});

$btnMessage.addEventListener('click', (e) => {
  e.preventDefault();

  const input = $form.querySelector('input#msg');
  if (input.value) {
    socket.emit('message', socket.id, input.value, () => {
      input.value = '';
      input.focus();
    });
  }

});

$btnLocation.addEventListener('click', (e) => {
  e.preventDefault();

  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');
  
  $btnMessage.setAttribute('disabled', 'disabled');
  $btnLocation.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position) => {
    const BASE_URL = 'https://google.com/maps?q=';
    const infos = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      // timestamp: position.timestamp,
    };
    const maps = `${BASE_URL}${infos.latitude},${infos.longitude}`;
    
    socket.emit('message', socket.id, maps, () => {
      $btnMessage.removeAttribute('disabled');
      $btnLocation.removeAttribute('disabled');
    });
  });

});
