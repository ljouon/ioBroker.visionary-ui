import { expect } from 'chai';
import WebSocket, { AddressInfo } from 'ws';
import { VisionaryUiSocketServer } from './visionary-ui.socket';

describe('VisionaryUiSocketServer Integration Tests', () => {
    let socketServer: VisionaryUiSocketServer;
    let port: number;

    beforeEach(async () => {
        socketServer = new VisionaryUiSocketServer();
        await socketServer.start(0);
        const address: AddressInfo = socketServer['socketServer']?.address() as AddressInfo;
        port = address.port;
    });

    afterEach(async () => {
        await socketServer.stop();
    });

    describe('WebSocket Communication', () => {
        it('should allow clients to connect', (done) => {
            const client = new WebSocket(`ws://localhost:${port}`);

            client.on('open', () => {
                expect(client.readyState).to.equal(WebSocket.OPEN);
                client.close();
                done();
            });
        });

        it('should handle client disconnection', (done) => {
            const client = new WebSocket(`ws://localhost:${port}`);

            client.on('open', () => {
                client.close();
            });

            client.on('close', () => {
                // Add additional assertions here if needed
                done();
            });
        });
    });

    describe('VisionaryUiSocketServer Additional Tests', () => {
        // Assuming socketServer and port setup as in previous tests

        let clients: WebSocket[] = [];
        let messages = [];
        let connectCount = 0;
        let disconnectCount = 0;

        beforeEach(() => {
            messages = [];
            connectCount = 0;
            disconnectCount = 0;

            const clientHandler = {
                onConnect: (_: string) => {
                    connectCount++;
                },
                onDisconnect: (_: string) => {
                    disconnectCount++;
                },
                onMessageFromClient: (clientId: string, content: string) => {
                    messages.push(content);
                },
            };

            socketServer.registerClientInboundHandler(clientHandler);
        });

        afterEach(() => {
            clients.forEach((client) => client.close());
            clients = [];
        });

        it('should handle client connection and disconnection', (done) => {
            const client = new WebSocket(`ws://localhost:${port}`);

            client.on('open', () => {
                setTimeout(() => {
                    expect(connectCount).to.equal(1);
                    client.close();
                }, 100);
            });

            client.on('close', () => {
                setTimeout(() => {
                    expect(disconnectCount).to.equal(1);
                    done();
                }, 100);
            });
        });
    });

    describe('messageToAllClients', () => {
        it('should broadcast a message to all connected clients', (done) => {
            const client = new WebSocket(`ws://localhost:${port}`);

            const handleMessage = () => {
                client.close();
                done();
            };

            client.on('open', () => {
                client.on('message', handleMessage);
                socketServer.messageToAllClients(
                    JSON.stringify({
                        type: 'setValues',
                        data: [{ id: '0_userdata.0.Lampe.on', value: true }],
                    }),
                );
            });
        });
    });

    describe('messageToClient', () => {
        it('should send a message to a specific client', (done) => {
            const client = new WebSocket(`ws://localhost:${port}`);

            const handleMessage = () => {
                client.close();
                done();
            };

            client.on('open', () => {
                const clientId = socketServer['clients'].keys().next().value;
                client.on('message', handleMessage);
                socketServer.messageToClient(
                    clientId,
                    JSON.stringify({
                        type: 'setValues',
                        data: [{ id: '0_userdata.0.Lampe.on', value: true }],
                    }),
                );
            });
        });
    });
});
