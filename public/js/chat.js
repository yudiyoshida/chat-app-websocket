/* eslint-disable no-undef */
const socket = io();

const $form = window.document.querySelector('form');
const $btnMessage = $form.querySelector('form button#sendmsg');
const $btnLocation = window.document.querySelector('button#location');
const $messages = window.document.querySelector('div#messages');
const messageTemplate = window.document.querySelector('#message-template').innerHTML;
const locationTemplate = window.document.querySelector('#location-template').innerHTML;
const sideBarTemplate = window.document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('message', (object) => {
  const html = Mustache.render(messageTemplate, { object });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('location', (object) => {
  const html = Mustache.render(locationTemplate, { object });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('members', (object) => {
  const html = Mustache.render(sideBarTemplate, { object });
  window.document.querySelector('#sidebar').innerHTML = html;
});

$btnMessage.addEventListener('click', (e) => {
  e.preventDefault();

  const input = $form.querySelector('input#msg');
  if (input.value) {
    socket.emit('message', {
      username,
      room,
      message: input.value,
    }, () => {
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
    socket.emit('location', {
      username,
      room,
      message: maps,
    }, () => {
      enable($btnMessage);
      enable($btnLocation);
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    location.href = '/';
    alert(error);
  }
});

function disable(target) {
  target.setAttribute('disabled', 'disabled');
}

function enable(target) {
  target.removeAttribute('disabled');
}