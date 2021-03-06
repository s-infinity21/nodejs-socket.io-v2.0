const users = [];

function joinUser(id, username, room) {
	const user = { id, username, room };
	users.push(user);
	return user;
}

function currUser(id) {
	return users.find(user => user.id === id);
}

function disUser(id) {
	const index = users.findIndex(user => user.id === id);
	if (index !== -1) return users.splice(index, 1)[0];
}

function roomUser(room) {
	return users.filter(user => user.room === room);
}

module.exports = {
	joinUser,
	currUser,
	disUser,
	roomUser
};
