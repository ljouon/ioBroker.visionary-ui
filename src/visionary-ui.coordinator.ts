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
import { VisionaryUiWebServer } from './visionary-ui.web';
import { ClientInboundHandler, VisionaryUiSocketServer } from './visionary-ui.socket';
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

    constructor(
        repository: VisionaryUiDomainRepository = new VisionaryUiDomainRepository(),
        webserver: VisionaryUiWebServer = new VisionaryUiWebServer(),
        socketServer: VisionaryUiSocketServer = new VisionaryUiSocketServer(),
    ) {
        this.repository = repository;
        this.webServer = webserver;
        this.socketServer = socketServer;
    }

    async start(adapterHandle: AdapterHandle): Promise<void> {
        this.adapter = adapterHandle;
        await this.webServer.start(adapterHandle.config.webPort);
        await this.socketServer.start(adapterHandle.config.socketPort);

        const clientInboundHandler: ClientInboundHandler = {
            onMessageFromClient: (clientId: string, content: string) => this.onMessageFromClient(clientId, content),
            onConnect: (clientId) => this.onClientConnect(clientId),
            onDisconnect: (clientId) => this.onClientDisconnect(clientId),
        };
        this.socketServer.registerClientInboundHandler(clientInboundHandler);
    }

    async stop(): Promise<void> {
        await this.webServer.stop();
        await this.socketServer.stop();
        this.adapter = null;
    }

    setRooms(rooms: IobRoomCache): void {
        this.repository.setRooms(rooms);
        this.socketServer.messageToAllClients(JSON.stringify(rooms.values()));
    }

    setRoom(element: IobRoom): void {
        this.repository.setRoom(element);
        this.socketServer.messageToAllClients(JSON.stringify(element));
    }

    deleteRoom(id: string): void {
        this.repository.deleteRoom(id);
        this.socketServer.messageToAllClients(JSON.stringify(this.repository.getRooms().values()));
    }

    setFunctions(functions: IobFunctionCache): void {
        this.repository.setFunctions(functions);
        this.socketServer.messageToAllClients(JSON.stringify(functions.values()));
    }

    setFunction(element: IobFunction): void {
        this.repository.setFunction(element);
        this.socketServer.messageToAllClients(JSON.stringify(element));
    }

    deleteFunction(id: string): void {
        this.repository.deleteFunction(id);
        this.socketServer.messageToAllClients(JSON.stringify(this.repository.getFunctions().values()));
    }

    setObjects(objects: IobObjectCache): void {
        // Only store objects mapped to at least one room
        objects.deleteByFilter((object) => !this.repository.isMappedToRoom(object));

        this.repository.setObjects(objects);
        this.socketServer.messageToAllClients(JSON.stringify(objects.values()));
    }

    setObject(iobObject: IobObject): void {
        // Only store objects mapped to at least one room
        if (this.repository.isMappedToRoom(iobObject)) {
            this.repository.setObject(iobObject);
            this.socketServer.messageToAllClients(JSON.stringify(iobObject));
        }
    }

    deleteObject(id: string): void {
        this.repository.deleteObject(id);
        this.repository.deleteState(id);
        this.socketServer.messageToAllClients(JSON.stringify(this.repository.getObjects().values()));
        this.socketServer.messageToAllClients(JSON.stringify(this.repository.getStates().values()));
    }

    setStates(iobStates: IobStateCache): void {
        // Only store states if object is managed
        const managedObjectIds = this.repository.getObjects().ids();
        iobStates.deleteByFilter((state) => !managedObjectIds.includes(state.id));
        this.repository.setStates(iobStates);
        this.socketServer.messageToAllClients(JSON.stringify(iobStates.values()));
    }

    setState(iobState: IobState): void {
        // Only store state if object is managed
        if (this.repository.getObjects().has(iobState.id)) {
            this.repository.setState(iobState);
            this.socketServer.messageToAllClients(JSON.stringify(iobState));
        }
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);
        const rooms = this.repository.getRooms().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(rooms));

        const functions = this.repository.getFunctions().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(functions));

        const objects = this.repository.getObjects().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(objects));

        const states = this.repository.getStates().values();
        this.socketServer.messageToClient(clientId, JSON.stringify(states));
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
        this.socketServer.messageToAllClients(JSON.stringify(m));
    }
}
