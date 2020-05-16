import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

import "smelte/src/tailwind.css";

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

let messages = [];

const users = new Map();

function broadcast(message) {
    let msgData = {
        message,
        type: 'broadcast'
    }
    messages.push(msgData);
    io.sockets.emit('message', msgData);
}

function sendEvent(evtData) {
    io.sockets.emit('event', evtData);
}

let numRgx = /-([1-9]+)$/

io.on('connection', (socket)=>{
    socket.on('message', message => {
        if(typeof message !== 'string' || message.length > 250) { // Server side validation.
            return;
        }
        let msg = {
            message,
            name: users.get(socket.id),
        }
        socket.broadcast.emit('message', msg);
        msg.type = 'me';
        socket.emit('message', msg);
    });
    socket.on('typing', (isTyping) => {
        sendEvent({
            action: 'typing-' + isTyping,
            data: users.get(socket.id),
        })
    })
    socket.on('disconnect', () => {
        if(!users.has(socket.id)) {
            return;
        }
        sendEvent({
            action: "user-leave",
            data: users.get(socket.id),
        });
        // Gets a random greeting, and inserts a name into it.
        broadcast(goodbyes.getRandomMessage(users.get(socket.id)));
        users.delete(socket.id);
    });
    // Normal connection events can't pass arguments, so we create our own event to pass our name argument and broadcast a welcome message with it.
    socket.on('user-join', name=> {
        //Validatation for if the user actually joined for the first time.
        if(users.has(socket.id) || name.length > 12) {
            return;
        }
        let names = [...users.values()]; // Convert iterable usernames to array.
        while(names.includes(name)) {
            // Checks if the name has '-number' tag at the end, if so, change the number by +1, else give it a number tag.
            let results = name.match(numRgx);
            if(results) {
                name = `${name.substr(0, results.index)}-${parseInt(results[1])+1}`;
            } else {
                name = name + '-1';
            }
        }
        names.concat(name); // Add user's name to be displayed on userlist instead of reconverting from interator.
        users.set(socket.id, name);

        // Give existing data to the users on join.
        socket.emit("welcome", {
            messages, 
            users: names,
        });

        sendEvent({
            action: "user-join",
            data: name
        });

        broadcast(greetings.getRandomMessage(name));
    })
});

Array.prototype.getRandomMessage = function(input) {
    return this[Math.floor(Math.random() * this.length)].replace('$', input);
}

let greetings = [
    "Glad to meet you, $!",
    "Welcome home, $.",
    "Checking out this chat, $?",
    "Wanted in on the fun, $?",
    "Everyone be nice to $.",
], goodbyes = [
    "Goodbye, $!",
    "Fun talkin to ya, $.",
    "See you later, $.",
    "$ has left the party."
]