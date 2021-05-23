const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userArr = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

socket.emit('join-room', {
	username,
	room
});

socket.on('room-users', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

socket.on('message', message => {
	console.log(message);
	outputMessage(message);

	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', event => {
	event.preventDefault();
	const msg = event.target.elements.msg.value;
	socket.emit('chatMessage', msg);
	event.target.elements.msg.value = '';
	event.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username} <span> ${message.time} </span> </p> <p class="text"> ${message.text} </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
	roomName.innerText = room;
}

function outputUsers(users) {
	userArr.innerHTML = `${users
		.map(user => `<li>${user.username}</li>`)
		.join('')}`;
}

document.getElementById('leave-btn').addEventListener('click', () => {
	const leaveRoom = confirm('Are you sure you want to leave?');
	if (leaveRoom) {
		window.location = '../index.html';
	}
});
