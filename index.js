const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users = new Set();

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
        users.add(user);
        console.log(users);
        socket.user = user;
        io.emit('chat message', `${user} joined the chat!`)
        io.emit('user list', {users: [...users]})
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

http.listen(3000,() => {
    console.log('listening on port 3000');
})