import {
    IobFunction,
    IobFunctionCache,
    IobObject,
    IobObjectCache,
    IobRoom,
    IobRoomCache,
    IobState,
    IobStateCache,
} from './domain';
import { createWebServer, VisionaryUiWebServer } from './visionary-ui.web';
import { ClientInboundHandler, createSocketServer, VisionaryUiSocketServer } from './visionary-ui.socket';
import { VisionaryUiDomainRepository } from './visionary-ui.domain.repository';

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
    private repository: VisionaryUiDomainRepository;
    private webServer: VisionaryUiWebServer;
    private socketServer: VisionaryUiSocketServer;
    private adapter: AdapterHandle | null = null;

    constructor() {
        this.repository = new VisionaryUiDomainRepository();
        this.webServer = createWebServer();
        this.socketServer = createSocketServer();
    }

    start(adapterHandle: AdapterHandle): void {
        this.adapter = adapterHandle;
        this.webServer.start(adapterHandle.config.webPort);
        this.socketServer.start(adapterHandle.config.socketPort);

        const clientInboundHandler: ClientInboundHandler = {
            onMessageFromClient: (clientId: string, content: string) => this.onMessageFromClient(clientId, content),
            onConnect: (clientId) => this.onClientConnect(clientId),
            onDisconnect: (clientId) => this.onClientDisconnect(clientId),
        };
        this.socketServer.registerClientInboundHandler(clientInboundHandler);
    }

    stop(): void {
        this.webServer.stop();
        this.socketServer.stop();
        this.adapter = null;
    }

    setRooms(rooms: IobRoomCache): void {
        this.repository.setRooms(rooms);
    }

    setRoom(room: IobRoom): void {
        this.repository.setRoom(room);
    }

    setFunctions(functions: IobFunctionCache): void {
        this.repository.setFunctions(functions);
    }

    setFunction(element: IobFunction): void {
        this.repository.setFunction(element);
    }

    setObjects(objects: IobObjectCache): void {
        // Only store objects mapped to at least one room
        objects.deleteByFilter((object) => !this.repository.isMappedToRoom(object));

        this.repository.setObjects(objects);
        this.socketServer.messageToAllClients(JSON.stringify(objects));
    }

    setObject(iobObject: IobObject): void {
        // Only store objects mapped to at least one room
        if (this.repository.isMappedToRoom(iobObject)) {
            this.repository.setObject(iobObject);
            this.socketServer.messageToAllClients(JSON.stringify(iobObject));
        }
    }

    setStates(states: IobStateCache): void {
        // Only handle states of objects mapped to at least one room
        const managedObjectIds = this.repository.getObjects().keys();
        states.deleteByFilter((state) => !managedObjectIds.includes(state.id));
        this.repository.setStates(states);
        this.socketServer.messageToAllClients(JSON.stringify(states));
    }

    setState(iobState: IobState): void {
        // Only store objects mapped to at least one room
        const managedObjectIds = this.repository.getObjects().keys();
        if (managedObjectIds.includes(iobState.id)) {
            this.repository.setState(iobState);
            this.socketServer.messageToAllClients(JSON.stringify(iobState));
        }
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);
        const rooms = this.repository.getRooms();
        this.socketServer.messageToClient(clientId, JSON.stringify(rooms, null, 2));

        const functions = this.repository.getFunctions();
        this.socketServer.messageToClient(clientId, JSON.stringify(functions, null, 2));

        const objects = this.repository.getObjects().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(objects, null, 2));

        const states = this.repository.getStates().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(states, null, 2));
    }

    private onClientDisconnect(clientId: string): void {
        // NO OP
        console.log(`Client disconnected: ${clientId}`);
    }

    private onMessageFromClient(clientId: string, content: string): void {
        console.log(`Inbound message from client ${clientId}: ${content}`);
        this.setAdapterState();
    }

    setAdapterState(): void {
        this.adapter?.setState('clientId', '0_userdata.0.Lampe.on', true);
    }

    debug(m: any): void {
        this.socketServer.messageToAllClients(JSON.stringify(m, null, 2));
    }
}
