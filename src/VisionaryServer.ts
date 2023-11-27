import { createServer, Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import path from 'path';

export type VisionaryServer = {
    start: (webServerPort: number, webSocketServerPort: number) => void;
    sendMessageToClients: (message: string) => void;
    stop: () => void;
    shutDown: () => void;
};

export function createVisionaryServer(): VisionaryServer {
    let webServer: Server | null;
    let socketServer: WebSocketServer | null;

    let connections: any[] = [];

    function createWebServer(): Server {
        const app = express();
        app.use('/', express.static(path.join(__dirname, '../build/client/')));
        app.get('/hello', (req, res) => {
            res.send('Hello!');
        });
        return createServer(app);
    }

    const startWebServer = (port: number): void => {
        if (webServer) {
            console.log('Webserver already started');
            return;
        }

        webServer = createWebServer();
        webServer.removeAllListeners();
        const connection = webServer.listen(port, () => {
            console.log(`Web server started on port: ${port}`);
        });

        connections.push(connection);
        connection.on('close', () => (connections = connections.filter((curr) => curr !== connection)));
    };

    const startSocketServer = (port: number): void => {
        if (socketServer) {
            console.log('Socket server already started');
            return;
        }
        socketServer = new WebSocket.Server({ port }, () => {
            console.log(`Socket server started on port: ${port}`);
        });

        socketServer.on('connection', (ws: WebSocket) => {
            console.log('New client connected');

            ws.on('message', (message: string) => {
                console.log(`Received message: ${message}`);
                socketServer?.clients.forEach((client) => {
                    client.send(`Server received your message: ${message}`);
                });
            });

            ws.on('close', () => {
                console.log('Client disconnected');
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

    const shutDown = (): void => {
        console.log('Received kill signal, shutting down gracefully');
        stop();

        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);

        connections.forEach((curr) => curr.end());
        setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
    };

    const sendMessage = (message: string): void => {
        console.log(`Server sends message: ${message}`);

        socketServer?.clients.forEach((client) => {
            console.log(client);
            client.send(message);
        });
    };

    return {
        start,
        sendMessageToClients: sendMessage,
        stop,
        shutDown,
    };
}
