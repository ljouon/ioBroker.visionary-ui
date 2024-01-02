import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';

export type ClientInboundHandler = {
    onConnect: (clientId: string) => void;
    onDisconnect: (clientId: string) => void;
    onMessageFromClient: (clientId: string, content: string) => void;
};

export abstract class ClientCommunication {
    abstract registerClientInboundHandler(clientInboundHandler: ClientInboundHandler): void;

    abstract messageToClient(clientId: string, message: string): void;

    abstract messageToAllClients(message: string): void;
}

export class VisionaryUiSocketServer extends ClientCommunication {
    private socketServer: WebSocketServer | null = null;
    private clientInboundHandler: ClientInboundHandler | null = null;
    private clients = new Map<string, WebSocket>();

    start(server: Server): void {
        this.socketServer = new WebSocket.Server({ server }, () => {
            console.log(`Socket server started`);
        });

        this.socketServer.on('connection', (ws: WebSocket) => {
            const clientId = uuidv4();
            this.clients.set(clientId, ws);

            this.clientInboundHandler?.onConnect(clientId);

            ws.on('message', (message: string) => {
                this.clientInboundHandler?.onMessageFromClient(clientId, message);
            });

            ws.on('close', (_) => {
                this.clients.delete(clientId);
                this.clientInboundHandler?.onDisconnect(clientId);
            });
        });
    }

    stop(): void {
        // Reset client connection handler
        this.clientInboundHandler = null;

        // Close socket server
        this.socketServer?.close(() => {
            console.log('Socket server closed');
            this.socketServer = null;
        });
    }

    messageToAllClients(message: string): void {
        // console.log(`Server sends message: ${message}`);
        this.socketServer?.clients.forEach((client) => {
            client.send(message);
        });
    }

    messageToClient(clientId: string, message: string): void {
        if (this.clients.has(clientId)) {
            // console.log(`Server sends message: ${message}`);
            const clientSocket = this.clients.get(clientId)!;
            clientSocket.send(message);
        }
    }

    registerClientInboundHandler(clientInboundHandler: ClientInboundHandler): void {
        this.clientInboundHandler = clientInboundHandler;
    }
}
