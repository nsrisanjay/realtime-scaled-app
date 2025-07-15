import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port:6969});


interface RoomType{
    sockets:WebSocket[]
}

// this DS maintains the room and the respective wescoket connections attacjed to it.
// key-value pair
const rooms:Record<string,RoomType> = {}

// create a websocket connection to the relayer socket
const RELAYER_URL = "ws://localhost:6970"
const relayerSocket = new WebSocket(RELAYER_URL);


// join-room message need not to go to the relayer, it can stay in wss.
// but chat message needs to go to the relayer.
relayerSocket.on('message',(data:string)=>{
        // websockets only serve either binary data or data in format of a string
        const parsedData = JSON.parse(data)
        const room:string = parsedData.room
        if(parsedData.type === 'chat')
        {
            // send this message to every socket of that room
            // we cant use broadcast since it doesnot distinguish between users and different rooms.
            rooms[room].sockets.map(ws => ws.send(data));
            console.log(data);
        }
        // console.log("received msg is ",data);
})

wss.on('connection',(ws:WebSocket)=>{
    ws.on('error',console.error);

    // on receiving a message
    ws.on('message',(data:string)=>{
        const parsedData = JSON.parse(data)
        const room:string = parsedData.room
        if(parsedData.type === 'join-room')
        {
            // create a websocket instance and add it to the rooms DS
            // check if room exists
            if(!rooms[room])
            {
                // add to DS
                rooms[room] = {
                    sockets:[]
                }
            }
            // add the newly created socket to the room DS.
            rooms[room].sockets.push(ws);
            console.log("pushed ws to room");
        }
        if(parsedData.type === 'chat')
        {
            relayerSocket.send(data)
        }
    })
    console.log('client connected to server')
});




 