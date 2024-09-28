import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Player() {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io('http://localhost:5000');
		setSocket(newSocket);

		newSocket.on('update', (message) => {
		console.log('Message from server:', message.data);
	});

	return () => newSocket.close();
}, []);

const joinGame = () => {
	socket.emit('join_game', { player_id: '123' });
	console.log("sent request")
};

return (
	<div>
		<h1>Player Interface</h1>
		<button onClick={joinGame}>Join Game</button>
	</div>
	);
}

export default Player;
