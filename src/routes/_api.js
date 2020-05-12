import { writable } from "svelte/store";
import io from "socket.io-client";

// We say login, but in reality, you are already connected to the server.
// If you actually wanted to authenticate the user, connect to the server after the user inputted his credentials and validate them on the server during connect (ie. through cookies).

let name, socket;
let _loggedIn = writable(false);
let _messages = writable([], () => {
    socket = io();
    socket.emit("give-messages");
    socket.on("recieve-messages", (msgs) => {
        console.log(msgs);
        _messages.set(msgs);
    });
    socket.on("message", (msg) => {
        _messages.update(msgs=>[...msgs,msg]);
    });

    // Normally you would want to disconnect after the user leaves the page that needs the socket, but we don't need to as our main and only functionality uses sockets.  
    // return () => {
    //     if(socket){
    //         socket.disconnect(true);
    //         socket = null;
    //     }   
    // }
});


// Only allow the api to manage the stores.
export let messages = {subscribe: _messages.subscribe};
export let loggedIn = {subscribe: _loggedIn.subscribe};

export const api = {
    setName: (newname) => {
        name = newname;
        _loggedIn.set(true);
        if(socket)
            socket.emit('user-join', newname);
    },
    sendMessage: (message) => {
        let msg = {name, message, type: 'me'};
        _messages.update(msgs=>[...msgs,msg]);
        socket.emit("message", msg);
    }
}