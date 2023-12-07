import {
    VuiEnvelope,
    VuiFunction,
    VuiFunctionCache,
    VuiRoom,
    VuiRoomCache,
    VuiStateObject,
    VuiStateObjectCache,
    VuiStateValue,
    VuiStateValueCache,
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

    setRooms(rooms: VuiRoomCache): void {
        this.repository.setRooms(rooms);
        const envelope: VuiEnvelope = { type: 'allRooms', data: rooms.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setRoom(vuiRoom: VuiRoom): void {
        this.repository.setRoom(vuiRoom);
        const envelope: VuiEnvelope = { type: 'room', data: vuiRoom };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteRoom(id: string): void {
        this.repository.deleteRoom(id);
        const envelope: VuiEnvelope = { type: 'allRooms', data: this.repository.getRooms().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunctions(functions: VuiFunctionCache): void {
        this.repository.setFunctions(functions);
        const envelope: VuiEnvelope = { type: 'allFunctions', data: this.repository.getFunctions().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunction(element: VuiFunction): void {
        this.repository.setFunction(element);
        const envelope: VuiEnvelope = { type: 'function', data: element };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteFunction(id: string): void {
        this.repository.deleteFunction(id);
        const envelope: VuiEnvelope = { type: 'allFunctions', data: this.repository.getFunctions().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObjects(vuiStateObjectCache: VuiStateObjectCache): void {
        // Only store vuiStateObjectCache mapped to at least one room
        vuiStateObjectCache.deleteByFilter((object) => !this.repository.isMappedToRoom(object));

        this.repository.setStateObjects(vuiStateObjectCache);
        const envelope: VuiEnvelope = { type: 'allStates', data: vuiStateObjectCache.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObject(vuiStateObject: VuiStateObject): void {
        // Only store objects mapped to at least one room
        if (this.repository.isMappedToRoom(vuiStateObject)) {
            this.repository.setStateObject(vuiStateObject);
            const envelope: VuiEnvelope = { type: 'state', data: vuiStateObject };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    deleteObject(id: string): void {
        this.repository.deleteStateObject(id);
        this.repository.deleteStateValue(id);
        const envelopeStates: VuiEnvelope = { type: 'allStates', data: this.repository.getStateObjects().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelopeStates));
        const envelopeValues: VuiEnvelope = { type: 'allValues', data: this.repository.getStateValues().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelopeValues));
    }

    setStates(vuiStateCache: VuiStateValueCache): void {
        // Only store states if object is managed
        const managedObjectIds = this.repository.getStateObjects().ids();
        vuiStateCache.deleteByFilter((state) => !managedObjectIds.includes(state.id));
        this.repository.setStateValues(vuiStateCache);
        const envelope: VuiEnvelope = { type: 'allValues', data: vuiStateCache.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setState(vuiStateValue: VuiStateValue): void {
        // Only store state if object is managed
        if (this.repository.getStateObjects().has(vuiStateValue.id)) {
            this.repository.setStateValue(vuiStateValue);
            const envelope: VuiEnvelope = { type: 'value', data: vuiStateValue };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);
        const rooms = this.repository.getRooms().values();
        const envelopeRooms: VuiEnvelope = { type: 'allRooms', data: rooms };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeRooms));

        const functions = this.repository.getFunctions().values();
        const envelopeFunctions: VuiEnvelope = { type: 'allFunctions', data: functions };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeFunctions));

        const stateObjects = this.repository.getStateObjects().values();
        const envelopeStateObjects: VuiEnvelope = { type: 'allStates', data: stateObjects };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeStateObjects));

        const states = this.repository.getStateValues().values();
        const envelopeStateValues: VuiEnvelope = { type: 'allValues', data: states };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeStateValues));
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
