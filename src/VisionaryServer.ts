import { createServer, Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export type ClientConnectionHandler = {
    connect: (clientId: string) => void;
    disconnect: (clientId: string) => void;
};

export type SocketClient = {
    id: string;
};

export type VisionaryServer = {
    start: (webServerPort: number, webSocketServerPort: number) => void;
    stop: () => void;
    sendBroadcastMessage: (message: string) => void;
    registerClientConnectionHandler: (clientConnectHandler: ClientConnectionHandler) => void;
    sendMessageToClient: (clientId: string, message: string) => void;
};

export function useVisionaryServer(): VisionaryServer {
    let webServer: Server | null;
    let socketServer: WebSocketServer | null;
    let clientConnectHandler: ClientConnectionHandler | null;
    const clients = new Map<string, WebSocket>();

    function createWebServer(): Server {
        const app = express();
        app.use('/', express.static(path.join(__dirname, '../build/client/')));
        app.get('/hello', (req, res) => {
            res.send('Hello!');
        });
        return createServer(app);
    }

    const startWebServer = (port: number): void => {
        webServer = createWebServer();
        webServer.listen(port, () => {
            console.log(`Web server started on port: ${port}`);
        });
    };

    const startSocketServer = (port: number): void => {
        socketServer = new WebSocket.Server({ port }, () => {
            console.log(`Socket server started on port: ${port}`);
        });

        socketServer.on('connection', (ws: WebSocket) => {
            console.log('New client connected');

            const clientId = uuidv4();
            clients.set(clientId, ws);

            clientConnectHandler?.connect(clientId);

            ws.on('message', (message: string) => {
                console.log(`Received message: ${message}`);
                socketServer?.clients.forEach((client) => {
                    client.send(`Server received your message: ${message}`);
                });
            });

            ws.on('close', (code) => {
                clients.delete(clientId);
                console.log(`${clientId} closed the connection: exit code ${code}`);
                clientConnectHandler?.disconnect(clientId);
            });
        });
    };

    const start = (webServerPort: number, webSocketServerPort: number): void => {
        startWebServer(webServerPort);
        startSocketServer(webSocketServerPort);
    };

    const stop = (): void => {
        webServer?.close(() => {
            console.log('Web server closed');
            webServer = null;
        });
        socketServer?.close(() => {
            console.log('Socket server closed');
            socketServer = null;
        });
    };

    const sendMessageToAllConnectedClients = (message: string): void => {
        console.log(`Server sends message: ${message}`);

        socketServer?.clients.forEach((client) => {
            console.log(client);
            client.send(message);
        });
    };

    const sendMessageToClient = (clientId: string, message: string): void => {
        if (clients.has(clientId)) {
            console.log(`Server sends message: ${message}`);
            const clientSocket = clients.get(clientId)!;
            clientSocket.send(message);
        }
    };

    const registerClientConnectionHandler = (connectHandler: ClientConnectionHandler): void => {
        clientConnectHandler = connectHandler;
    };

    return {
        start,
        stop,
        sendBroadcastMessage: sendMessageToAllConnectedClients,
        sendMessageToClient,
        registerClientConnectionHandler,
    };
}
