import { writable } from "svelte/store";
import io from "socket.io-client";

// We say login, but in reality, you are already connected to the server.
// If you actually wanted to authenticate the user, connect to the server after the user inputted his credentials and validate them on the server during connect (ie. through cookies).

let name, socket;
let _users = writable([]);
let _typingUsers = writable([]);
let _loggedIn = writable(false);
let _messages = writable([], () => {
    socket = io();
    socket.on("welcome", (data) => {
        console.log("Welcome",data);
        _messages.set(data.messages);
        _users.set(data.users);
    });
    socket.on("message", (msg) => {
        console.log("Message",msg)
        _messages.update(msgs=>[...msgs,msg]);
        if(msg.type === 'server') {
            if(msg.action === "join") {
                _usercount.update(u => u + 1);
            } else if (msg.action === "leave") {
                _usercount.update(u => u - 1);
            }
        }
    });
    socket.on("event", (evt) => {
        console.log("Event", evt)
        switch(evt.action) {
            case 'user-join':
                _users.update(val=> [...val, evt.data]);
                break;
            case 'typing-true': 
                _typingUsers.update(val=> [...val, evt.data]);
                break;
            case 'user-leave':
                _users.update(val => val.filter(name => name != evt.data));
            case 'typing-false':
                _typingUsers.update(val => val.filter(name => name != evt.data));
                break;
            // We let user-leave fall through so it also removes typing users if they leave during typing.
        }
    })

    // Normally you would want to disconnect after the user leaves the page that needs the socket, but we don't need to as our main and only functionality uses sockets.  
    // return () => {
    //     if(socket){
    //         socket.disconnect(true);
    //         socket = null;
    //     }   
    // }
});


let timeout;
function endTyping() {
    timeout = null;
    socket.emit('typing', false);
}

// Typing false emits not typing. Typing true emits typing. And typing undefined sets the timeout.
export function typing(isTyping) {
    if(isTyping === false) {
        clearTimeout(timeout);
        endTyping();
    } else if(timeout){
        clearTimeout(timeout);
        timeout = setTimeout(endTyping, 2500);
    } else {
        timeout = setTimeout(endTyping, 2500);
        socket.emit('typing', true);
    }
}

// Only allow the api to manage the stores.
export let messages = {subscribe: _messages.subscribe};
export let loggedIn = {subscribe: _loggedIn.subscribe};
export let users = {subscribe: _users.subscribe};
export let typingUsers = {subscribe: _typingUsers.subscribe}

export const api = {
    setName: (newname) => {
        name = newname;
        _loggedIn.set(true);
        if(socket)
            socket.emit('user-join', newname);
    },
    sendMessage: (message) => {
        socket.emit("message", message);
    },
}