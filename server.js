const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const formatMessage = require('./utility/messages');
const { joinUser, currUser, disUser, roomUser } = require('./utility/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set static folders
app.use(express.static(path.join(__dirname, 'public')));
const appName = 'RealTalk App';

// Run when client connects
io.on('connection', socket => {
	socket.on('join-room', ({ username, room }) => {
		const user = joinUser(socket.id, username, room);
		socket.join(user.room);

		socket.emit('message', formatMessage(appName, 'Welcome to Realtalk!'));
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(appName, `${user.username} has joined the chat`)
			);
		io.to(user.room).emit('room-users', {
			room: user.room,
			users: roomUser(user.room)
		});
	});

	socket.on('chatMessage', msg => {
		const user = currUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	socket.on('disconnect', () => {
		const user = disUser(socket.id);
		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(appName, `${user.username} has left the chat`)
			);

			io.to(user.room).emit('room-users', {
				room: user.room,
				users: roomUser(user.room)
			});
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server Loaded on port ${PORT}`);
});
