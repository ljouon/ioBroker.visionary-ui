import { createServer, Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import path from 'path';

export type VisionaryServer = {
    start: (webServerPort: number, webSocketServerPort: number) => void;
    stop: () => void;
};

export function createVisionaryServer(): VisionaryServer {
    let webServer: Server | null;
    let socketServer: WebSocketServer | null;

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

    return {
        start,
        stop,
    };
}
