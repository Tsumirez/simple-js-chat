const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users = new Map();

app.use(express.static('public'));
// app.get('/', (req,res) => {
//     //res.send('<h1>Hello World</h1>');
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {

    socket.on('chat message', msg => {
        io.emit('chat message', socket.user + ': ' + msg);
    })

    socket.on('add user', user => {
        if(users.has(user)) {
            socket.emit('nick taken',user);
            return;
        }
        users.set(user,socket.id);
        socket.user = user;
        io.emit('message', {msg:`${user} joined the chat!`})
        io.emit('user add', {users: [...users.keys()]})
    })

    socket.on('disconnect', () => {
        users.delete(socket.user);
        io.emit('user left', {users: [...users.keys()]})
        io.emit('message', {msg: `${socket.user} has left the chat`})
    })

    socket.on('message',({to, msg}=data) => {
        console.log(`message ${msg} received`)
        target = to?socket.to(users.get(to)):io;
        target.emit('message', {to:to, msg:`${socket.user}: ${msg}`});
        if (to) socket.emit('message', {to:to, msg: `to ${to}: ${msg}`})
    })
})

http.listen(3000,() => {
    console.log('listening on port 3000');
})