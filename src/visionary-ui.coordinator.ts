import {
    StateValue,
    VuiActionEnvelope,
    VuiDataEnvelope,
    VuiFunction,
    VuiRoom,
    VuiStateObject,
    VuiStateValue,
} from './domain';
import { VisionaryUiWebServer } from './visionary-ui.web';
import { ClientInboundHandler, VisionaryUiSocketServer } from './visionary-ui.socket';
import { VisionaryUiDomainRepository } from './visionary-ui.domain.repository';
import { VuiCache } from './visionary-ui.cache';

export type StateSetter = (clientId: string, stateId: string, value: string | number | boolean | null) => void;

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
        await this.webServer.start(adapterHandle.config.webPort, adapterHandle.config.socketPort);
        await this.socketServer.start(adapterHandle.config.webPort, adapterHandle.config.socketPort);

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

    setRooms(rooms: VuiCache<VuiRoom>): void {
        this.repository.setRooms(rooms);
        const envelope: VuiDataEnvelope = { type: 'allRooms', data: rooms.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setRoom(vuiRoom: VuiRoom): void {
        this.repository.setRoom(vuiRoom);
        const envelope: VuiDataEnvelope = { type: 'room', data: vuiRoom };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteRoom(id: string): void {
        this.repository.deleteRoom(id);
        const envelope: VuiDataEnvelope = { type: 'allRooms', data: this.repository.getRooms().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunctions(functions: VuiCache<VuiFunction>): void {
        this.repository.setFunctions(functions);
        const envelope: VuiDataEnvelope = { type: 'allFunctions', data: this.repository.getFunctions().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setFunction(element: VuiFunction): void {
        this.repository.setFunction(element);
        const envelope: VuiDataEnvelope = { type: 'function', data: element };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    deleteFunction(id: string): void {
        this.repository.deleteFunction(id);
        const envelope: VuiDataEnvelope = { type: 'allFunctions', data: this.repository.getFunctions().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObjects(vuiStateObjectCache: VuiCache<VuiStateObject>): void {
        // Only store vuiStateObjectCache mapped to at least one room
        vuiStateObjectCache.deleteByFilter((object) => !this.repository.isMappedToRoom(object));

        this.repository.setStateObjects(vuiStateObjectCache);
        const envelope: VuiDataEnvelope = { type: 'allStates', data: vuiStateObjectCache.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setObject(vuiStateObject: VuiStateObject): void {
        // Only store objects mapped to at least one room
        if (this.repository.isMappedToRoom(vuiStateObject)) {
            this.repository.setStateObject(vuiStateObject);
            const envelope: VuiDataEnvelope = { type: 'state', data: vuiStateObject };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    deleteObject(id: string): void {
        this.repository.deleteStateObject(id);
        this.repository.deleteStateValue(id);
        const envelopeStates: VuiDataEnvelope = { type: 'allStates', data: this.repository.getStateObjects().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelopeStates));
        const envelopeValues: VuiDataEnvelope = { type: 'allValues', data: this.repository.getStateValues().values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelopeValues));
    }

    setStates(vuiStateCache: VuiCache<VuiStateValue>): void {
        // Only store states if object is managed
        const managedObjectIds = this.repository.getStateObjects().ids();
        vuiStateCache.deleteByFilter((state) => !managedObjectIds.includes(state.id));
        this.repository.setStateValues(vuiStateCache);
        const envelope: VuiDataEnvelope = { type: 'allValues', data: vuiStateCache.values() };
        this.socketServer.messageToAllClients(JSON.stringify(envelope));
    }

    setState(vuiStateValue: VuiStateValue): void {
        // Only store state if object is managed
        if (this.repository.getStateObjects().has(vuiStateValue.id)) {
            this.repository.setStateValue(vuiStateValue);
            const envelope: VuiDataEnvelope = { type: 'value', data: vuiStateValue };
            this.socketServer.messageToAllClients(JSON.stringify(envelope));
        }
    }

    private onClientConnect(clientId: string): void {
        console.log(`Client connected: ${clientId}`);

        const configurationData = {
            language: this.adapter?.config.language || 'en',
        };
        this.socketServer.messageToClient(clientId, JSON.stringify({ type: 'configuration', data: configurationData }));

        const rooms = this.repository.getRooms().values();
        const envelopeRooms: VuiDataEnvelope = { type: 'allRooms', data: rooms };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeRooms));

        const functions = this.repository.getFunctions().values();
        const envelopeFunctions: VuiDataEnvelope = { type: 'allFunctions', data: functions };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeFunctions));

        const stateObjects = this.repository.getStateObjects().values();
        const envelopeStateObjects: VuiDataEnvelope = { type: 'allStates', data: stateObjects };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeStateObjects));

        const states = this.repository.getStateValues().values();
        const envelopeStateValues: VuiDataEnvelope = { type: 'allValues', data: states };
        this.socketServer.messageToClient(clientId, JSON.stringify(envelopeStateValues));
    }

    private onClientDisconnect(clientId: string): void {
        // NO OP
        console.log(`Client disconnected: ${clientId}`);
    }

    private onMessageFromClient(clientId: string, data: string): void {
        const actionEnvelope: VuiActionEnvelope = JSON.parse(data);
        console.log(`Inbound message from client ${clientId}: ${actionEnvelope}`);
        switch (actionEnvelope.type) {
            case 'setValues':
                this.setAdapterStates(clientId, actionEnvelope.data);
                break;
            default:
                console.error(`unknown element type: ${JSON.stringify(actionEnvelope)}`);
        }
    }

    setAdapterStates(clientId: string, stateValues: StateValue[]): void {
        stateValues.forEach((stateValue) => {
            this.adapter?.setState(clientId, stateValue.id, stateValue.value);
        });
    }
}
