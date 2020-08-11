//node server
const path = require('path')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = process.env.port || 80;
app.use(express.static(path.join(__dirname, "public")));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



const users = {};

// io.on instance ko sambhalega jese bhot s user aay toh unko sambhalega
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        // console.log("New User :", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', { name: users[socket.id] }); // ye jis user n join kiya uske alawa sabko inform krta h
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

server.listen(process.env.PORT || 80);