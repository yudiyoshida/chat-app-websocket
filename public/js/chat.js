/* eslint-disable no-undef */
const socket = io();

const $form = window.document.querySelector('form');
const $btnMessage = $form.querySelector('form button#sendmsg');
const $btnLocation = window.document.querySelector('button#location');
const $messages = window.document.querySelector('div#messages');
const messageTemplate = window.document.querySelector('#message-template').innerHTML;
const locationTemplate = window.document.querySelector('#location-template').innerHTML;

socket.on('message', (who, message) => {
  // console.log(`Sent by: ${who} | ${message}`);

  const html = Mustache.render(messageTemplate, { message });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (who, location) => {
  // console.log(`Sent by: ${who} | ${message}`);

  const html = Mustache.render(locationTemplate, { location });
  $messages.insertAdjacentHTML('beforeend', html);
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
  
  disable($btnMessage);
  disable($btnLocation);
  navigator.geolocation.getCurrentPosition((position) => {
    const BASE_URL = 'https://google.com/maps?q=';
    const infos = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      // timestamp: position.timestamp,
    };
    const maps = `${BASE_URL}${infos.latitude},${infos.longitude}`;
    
    socket.emit('location', socket.id, maps, () => {
      enable($btnMessage);
      enable($btnLocation);
    });
  });

});

function disable(target) {
  target.setAttribute('disabled', 'disabled');
}

function enable(target) {
  target.removeAttribute('disabled');
}