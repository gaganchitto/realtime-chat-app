//node server
const path = require('path')
const express = require('express');
const app = express();
// const fs = require('fs');
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const port = process.env.port || 80;


http.listen(port, () => {
    console.log("Listening on port ", port)
})

// app.use(express.static(path.join(__dirname, "public")));

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