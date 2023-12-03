import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { VisionaryUiServer } from './visionary-ui.server';

export type ClientInboundHandler = {
    onConnect: (clientId: string) => void;
    onDisconnect: (clientId: string) => void;
    onMessageFromClient: (clientId: string, content: string) => void;
};

export type VisionaryUiSocketServer = VisionaryUiServer & {
    registerClientInboundHandler: (clientInboundHandler: ClientInboundHandler) => void;
    messageToClient: (clientId: string, message: string) => void;
    messageToAllClients: (message: string) => void;
};

export function createSocketServer(): VisionaryUiSocketServer {
    let socketServer: WebSocketServer | null;
    let clientConnectHandler: ClientInboundHandler | null;
    const clients = new Map<string, WebSocket>();

    const start = (port: number): void => {
        socketServer = new WebSocket.Server({ port }, () => {
            console.log(`Socket server started on port: ${port}`);
        });

        socketServer.on('connection', (ws: WebSocket) => {
            console.log('New client connected');

            const clientId = uuidv4();
            clients.set(clientId, ws);

            clientConnectHandler?.onConnect(clientId);

            ws.on('message', (message: string) => {
                console.log(`Received message: ${message}`);

                clientConnectHandler?.onMessageFromClient(clientId, message);

                socketServer?.clients.forEach((client) => {
                    client.send(`Server received your message: ${message}`);
                });
            });

            ws.on('close', (code) => {
                clients.delete(clientId);
                console.log(`${clientId} closed the connection: exit code ${code}`);
                clientConnectHandler?.onDisconnect(clientId);
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

    const messageToAllClients = (message: string): void => {
        // console.log(`Server sends message: ${message}`);
        socketServer?.clients.forEach((client) => {
            client.send(message);
        });
    };

    const messageToClient = (clientId: string, message: string): void => {
        if (clients.has(clientId)) {
            // console.log(`Server sends message: ${message}`);
            const clientSocket = clients.get(clientId)!;
            clientSocket.send(message);
        }
    };

    const registerClientConnectionHandler = (connectHandler: ClientInboundHandler): void => {
        clientConnectHandler = connectHandler;
    };

    return {
        start,
        stop,
        messageToAllClients,
        messageToClient,
        registerClientInboundHandler: registerClientConnectionHandler,
    };
}
