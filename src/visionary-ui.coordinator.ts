import { IobFunction, IobObject, IobObjectCache, IobRoom, IobState, IobStateCache } from './domain';
import { createWebServer, VisionaryUiWebServer } from './visionary-ui.web';
import { ClientConnectionHandler, createSocketServer, VisionaryUiSocketServer } from './visionary-ui.socket';
import { VisionaryUiRepository } from './visionary-ui.repository';

export type StateSetter = (clientId: string, stateId: string, value: string | number | boolean) => void;

export type AdapterHandle = {
    setState: StateSetter;
    config: {
        language: string;
        webPort: number;
        socketPort: number;
    };
};

export class VisionaryUiCoordinator {
    private repository: VisionaryUiRepository;
    private webServer: VisionaryUiWebServer;
    private socketServer: VisionaryUiSocketServer;
    private adapter: AdapterHandle | null = null;

    constructor() {
        this.repository = new VisionaryUiRepository();
        this.webServer = createWebServer();
        this.socketServer = createSocketServer();
    }

    setAdapterState(): void {
        this.adapter?.setState('clientId', '0_userdata.0.Lampe.on', true);
    }

    start(adapterHandle: AdapterHandle): void {
        this.adapter = adapterHandle;
        this.webServer.start(adapterHandle.config.webPort);
        this.socketServer.start(adapterHandle.config.socketPort);

        const clientConnectionHandler: ClientConnectionHandler = {
            connect: (clientId) => this.onClientConnect(clientId),
            disconnect: (clientId) => this.onClientDisconnect(clientId),
        };
        this.socketServer.registerClientConnectionHandler(clientConnectionHandler);
    }

    stop(): void {
        this.webServer.stop();
        this.socketServer.stop();
        this.adapter = null;
    }

    // ### Data publishing ###

    setRooms(rooms: IobRoom[]): void {
        this.repository.setRooms(rooms);
    }

    setFunctions(functions: IobFunction[]): void {
        this.repository.setFunctions(functions);
    }

    setObjects(objects: IobObjectCache): void {
        this.repository.setObjects(objects);

        this.socketServer.sendBroadcastMessage(JSON.stringify(objects));
    }

    setObject(iobObject: IobObject): void {
        this.repository.setObject(iobObject);

        // Publish directly
        this.socketServer.sendBroadcastMessage(JSON.stringify(iobObject));
    }

    setStates(states: IobStateCache): void {
        this.repository.setStates(states);

        this.socketServer.sendBroadcastMessage(JSON.stringify(states));
    }

    setState(iobState: IobState): void {
        this.repository.setState(iobState);

        // Publish directly
        this.socketServer.sendBroadcastMessage(JSON.stringify(iobState));
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);
        const rooms = this.repository.getRooms();
        this.socketServer.sendMessageToClient(clientId, JSON.stringify({ rooms }));

        const functions = this.repository.getFunctions();
        this.socketServer.sendMessageToClient(clientId, JSON.stringify({ functions }));

        const objects = this.repository.getObjects();
        this.socketServer.sendMessageToClient(clientId, JSON.stringify({ objects }));

        const states = this.repository.getStates();
        this.socketServer.sendMessageToClient(clientId, JSON.stringify({ states }));
    }

    private onClientDisconnect(clientId: string): void {
        // NO OP
        console.log(`Client disconnected: ${clientId}`);
    }
}
