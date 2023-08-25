const express = require('express');
const http = require('http');
const path = require('path'); 
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// Track online users
let onlineUsers = 0;

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Increment the online user count and emit to all clients
    onlineUsers++;
    io.emit('onlineUsers', onlineUsers);

    socket.on('userJoined', (username) => {
        io.emit('userJoined', `${username} has joined the chat`);
    });

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('storeValue', (data) => {
        const { username, name, value } = data;
        io.emit('storeValue', { username, name, value });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Decrement the online user count and emit to all clients
        onlineUsers--;
        io.emit('onlineUsers', onlineUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
