const socket = io();

const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const chatDiv = document.getElementById('chat');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const message = input.value;
  if (message) {
    appendMessage('You', message, 'user');
    socket.emit('chat message', message);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  appendMessage('Bot', msg, 'bot');
});

function appendMessage(sender, message, className) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message ' + className;
  messageElement.innerHTML = '<strong>' + sender + ':</strong> ' + message;
  chatDiv.appendChild(messageElement);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}
