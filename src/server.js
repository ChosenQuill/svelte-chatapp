import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const app = express();
// We make our own http server here so we can use it with both express and socket.io instead of just express.
const server = require('http').Server(app);
var io = require('socket.io')(server);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	);

// Important! Calling express.listen will cause it to create its own http server. Instead, you want to call server.listen. 
server.listen(PORT, err => {
		if (err) console.log('error', err);
	});

// Usercount is available if we want to implement showing how many users are online.
let usercount = 0;

// We populate the dataset with some default values to give the user an idea of what a conversation would look like. 
let messages = [
    {name:"MangoMan", message: `Hey man, what's up?`},
    {name:"DCNewt", message: `I'm doin good, just checking out this app. Wbu?`},
    {name:"MangoMan", message: `Doin the same, looks kinda neat.`},
    {name:"DCNewt", message: `true`}
];

io.on('connection', (socket)=>{
    usercount++;
    socket.on('message', message => {
        // In a real life scenario, you may want to do validation checks to make sure the data is valid, but for this demo app, it isn't needed.
        messages.push(message);
        socket.broadcast.emit("message", message);
    });
    // Client wants the messages, so we send an event back with them.
    socket.on("give-messages", () => {
        socket.emit("recieve-messages", messages);
    });
    socket.on('disconnect', () => {
        usercount--;
    });
    // Normal connection events can't pass arguments, so we create our own event to pass our name argument and broadcast a welcome message with it.
    socket.on('user-join', name=> {
        const msg = {
            name: "Server",
            // Gets a random greeting, and inserts a name into it.
            message: greetings[Math.floor(Math.random() * greetings.length)].replace('$', name),
            type: "server"
        };
        messages.push(msg);
        io.sockets.emit('message', msg)
    })
});

let greetings = [
    "Glad to meet you, $!",
    "Welcome home, $.",
    "Checking out this chat, $?",
    "Wanted in on the fun, $?",
    "Everyone be nice to $.",
]