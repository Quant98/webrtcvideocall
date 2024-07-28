const WebSocket = require('ws');
require("dotenv").config();

const port = process.env.PORT || 8081;

const wss = new WebSocket.Server({ port }, () => {
    console.log(`Signalling server is now listening on port ${port}`);
});

wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`);

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage);
            wss.broadcast(ws, parsedMessage);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
    });

    ws.on('error', (error) => {
        console.log(`Client error. Total connected clients: ${wss.clients.size}`);
    });
});
