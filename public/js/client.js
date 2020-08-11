const socket = io();

const form = document.getElementById('send-container');
const msgInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio(`tone.mp3`);

const name = prompt('Enter Your Name :');
socket.emit('new-user-joined', name); // client s server pr name jaa chuka h

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); // page reload ni hoga;
    const message = msgInput.value;
    append(`You : ${message}`, 'right');
    socket.emit('send', message);
    msgInput.value = '';
    scrollTo();

})

// ab server s name leke aana h and apne msg container m dikhana h

socket.on('user-joined', data => {
    append(`${data.name} joined the Chat`, 'left');
    scrollTo();
})

socket.on('recieve', data => {
    append(`${data.name} : ${data.message}`, 'left');
    scrollTo();
})

socket.on('left', name => {
    append(`${name} left the Chat.`, 'left');
    scrollTo();
})

function scrollTo() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}