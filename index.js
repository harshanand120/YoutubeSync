const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id)
    socket.on("playing", () => {
        socket.broadcast.emit("playvideo")
    })
    socket.on("paused", (msg) => {
        socket.broadcast.emit("pausevideo")
    });
    // socket.on("playing", (msg) => {
    //     console.log("playing")
    //     socket.broadcast.emit("playvideo", msg)
    // })
})

io.on("disconnect", () => {
    console.log("disconnect")
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});