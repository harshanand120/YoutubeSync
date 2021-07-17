const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

let yturl = "https://www.youtube.com/watch?v=YZ5tOe7y9x4"

app.use(express.static("static"))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/link', function(req,res){
    res.send({'ytlink':yturl})
})


io.on('connection', (socket) => {
    socket.on("playing", (time) => {
        socket.broadcast.emit("playvideo", time)
    })
    socket.on("paused", (time) => {
        socket.broadcast.emit("pausevideo", time)
    });
    socket.on("seek", (time) => {
        socket.broadcast.emit("seek", time)
    });
    socket.on("load",(vidLink) => {
        socket.broadcast.emit("load",vidLink)
    })
})

server.listen(PORT, () => {
    console.log('listening on *:3000');
});