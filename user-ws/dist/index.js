"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 6969 });
// this DS maintains the room and the respective wescoket connections attacjed to it.
// key-value pair
const rooms = {};
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    // on receiving a message
    ws.on('message', (data) => {
        // websockets only serve either binary data or data in format of a string
        const parsedData = JSON.parse(data);
        const room = parsedData.room;
        if (parsedData.type === 'join-room') {
            // create a websocket instance and add it to the rooms DS
            // check if room exists
            if (!rooms[room]) {
                // add to DS
                rooms[room] = {
                    sockets: []
                };
            }
            // add the newly created socket to the room DS.
            rooms[room].sockets.push(ws);
            console.log("pushed ws to room");
        }
        if (parsedData.type === 'chat') {
            const dataToBeSent = JSON.stringify(data);
            // send this message to every socket of that room
            // we cant use broadcast since it doesnot distinguish between users and different rooms.
            rooms[room].sockets.map(ws => ws.send(dataToBeSent));
            console.log(dataToBeSent);
        }
        // console.log("received msg is ",data);
    });
    console.log('client connected to server');
});
