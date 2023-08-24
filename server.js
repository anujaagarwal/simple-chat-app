const express = require('express');
const http = require('http');
const path = require('path'); 
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userJoined', (username) => {
        io.emit('userJoined', `${username} has joined the chat`);
    });

    socket.on('message', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
