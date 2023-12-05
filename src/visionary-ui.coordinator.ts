import {
    Envelope,
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
        const envelope: Envelope = { type: 'rooms', data: rooms.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setRoom(element: IobRoom): void {
        this.repository.setRoom(element);
        const envelope: Envelope = { type: 'room', data: element };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteRoom(id: string): void {
        this.repository.deleteRoom(id);
        const envelope: Envelope = { type: 'rooms', data: this.repository.getRooms().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunctions(functions: IobFunctionCache): void {
        this.repository.setFunctions(functions);
        const envelope: Envelope = { type: 'functions', data: functions.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunction(element: IobFunction): void {
        this.repository.setFunction(element);
        const envelope: Envelope = { type: 'function', data: element };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteFunction(id: string): void {
        this.repository.deleteFunction(id);
        const envelope: Envelope = { type: 'functions', data: this.repository.getFunctions().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObjects(objects: IobObjectCache): void {
        // Only store objects mapped to at least one room
        objects.deleteByFilter((object) => !this.repository.isMappedToRoom(object));

        this.repository.setObjects(objects);
        const envelope: Envelope = { type: 'objects', data: objects.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObject(iobObject: IobObject): void {
        // Only store objects mapped to at least one room
        if (this.repository.isMappedToRoom(iobObject)) {
            this.repository.setObject(iobObject);
            const envelope: Envelope = { type: 'object', data: iobObject };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    deleteObject(id: string): void {
        this.repository.deleteObject(id);
        this.repository.deleteState(id);
        const objectsEnvelope = { type: 'objects', data: this.repository.getObjects().values() };
        this.socketServer.messageToAllClients(JSON.stringify(objectsEnvelope));
        const statesEnvelope = { type: 'states', data: this.repository.getStates().values() };
        this.socketServer.messageToAllClients(JSON.stringify(statesEnvelope));
    }

    setStates(iobStates: IobStateCache): void {
        // Only store states if object is managed
        const managedObjectIds = this.repository.getObjects().ids();
        iobStates.deleteByFilter((state) => !managedObjectIds.includes(state.id));
        this.repository.setStates(iobStates);
        const envelope: Envelope = { type: 'states', data: iobStates.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setState(iobState: IobState): void {
        // Only store state if object is managed
        if (this.repository.getObjects().has(iobState.id)) {
            this.repository.setState(iobState);
            const envelope: Envelope = { type: 'state', data: iobState };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);
        const rooms = this.repository.getRooms().values();
        const roomsEnvelope = { type: 'rooms', data: rooms };
        this.socketServer.messageToClient(clientId, JSON.stringify(roomsEnvelope));

        const functions = this.repository.getFunctions().values();
        const functionsEnvelope = { type: 'functions', data: functions };
        this.socketServer.messageToClient(clientId, JSON.stringify(functionsEnvelope));

        const objects = this.repository.getObjects().values();
        const objectsEnvelope = { type: 'objects', data: objects };
        this.socketServer.messageToClient(clientId, JSON.stringify(objectsEnvelope));

        const states = this.repository.getStates().values();
        const statesEnvelope = { type: 'states', data: states };
        this.socketServer.messageToClient(clientId, JSON.stringify(statesEnvelope));
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
}
