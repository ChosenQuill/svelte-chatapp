import { writable } from "svelte/store";
import io from "socket.io-client";


function getApi(){
    let name, socket;
    let data = writable({messages: []}, set => {
        socket = io();
        socket.emit("give-messages");
        socket.on("receive-messages", (messages) => {
            console.log(messages);
        })
    });

    return {
        subscribe: data.subscribe,
        setName: (newname) => {
            name = newname;
        },
        sendMessage: (message) => {
            let mdata = {name, message};
            data.update(data => {messages: [...data.messages, mdata]})
        }
    }
}

export const api = getApi();