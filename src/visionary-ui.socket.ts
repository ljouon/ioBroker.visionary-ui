import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { VisionaryUiServer } from './visionary-ui.server';

export type ClientConnectionHandler = {
    connect: (clientId: string) => void;
    disconnect: (clientId: string) => void;
};

export type VisionaryUiSocketServer = VisionaryUiServer & {
    sendBroadcastMessage: (message: string) => void;
    registerClientConnectionHandler: (clientConnectHandler: ClientConnectionHandler) => void;
    sendMessageToClient: (clientId: string, message: string) => void;
};

export function createSocketServer(): VisionaryUiSocketServer {
    let socketServer: WebSocketServer | null;
    let clientConnectHandler: ClientConnectionHandler | null;
    const clients = new Map<string, WebSocket>();

    const start = (port: number): void => {
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

    const stop = (): void => {
        // Reset client connection handler
        clientConnectHandler = null;

        // Close socket server
        socketServer?.close(() => {
            console.log('Socket server closed');
            socketServer = null;
        });
    };

    const sendMessageToAllConnectedClients = (message: string): void => {
        // console.log(`Server sends message: ${message}`);
        socketServer?.clients.forEach((client) => {
            client.send(message);
        });
    };

    const sendMessageToClient = (clientId: string, message: string): void => {
        if (clients.has(clientId)) {
            // console.log(`Server sends message: ${message}`);
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
