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
        if(users.has(user)) {
            socket.emit('nick taken',user);
            return;
        }
        users.add(user);
        socket.user = user;
        io.emit('chat message', `${user} joined the chat!`)
        io.emit('user add', {users: [...users]})
    })

    socket.on('disconnect', () => {
        users.delete(socket.user);
        io.emit('user left', {users: [...users]})
        io.emit('chat message', `${socket.user} has left the chat`)
    })
})

http.listen(3000,() => {
    console.log('listening on port 3000');
})