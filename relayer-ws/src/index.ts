import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port:6970});

// keep track of which websocket servers are connected to relayer
const servers: WebSocket[] = [];


wss.on('connection',(ws:WebSocket)=>{
    ws.on('error',console.error);

    // on receiving a message from server forward that to other servers.
    ws.on('message',(data:string)=>{
        // wheren ever there is a message forward to all other servers
        servers.filter(socket => socket!=ws).map(ws => ws.send(data));
    })
    servers.push(ws);

    console.log('Websocket server connected to the Relayer Websocket Server!')
});