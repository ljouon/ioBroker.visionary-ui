import sinon from 'sinon';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { VisionaryUiWebServer } from './visionary-ui.web';
import { VisionaryUiSocketServer } from './visionary-ui.socket';
import { VisionaryUiDomainRepository } from './visionary-ui.domain.repository';
import { VuiActionEnvelope, VuiFunction, VuiRoom, VuiStateObject, VuiStateValue } from './domain';
import { VuiCache } from './visionary-ui.cache';
import { Server } from 'http';

describe('VisionaryUiCoordinator', () => {
    let coordinator: VisionaryUiCoordinator;
    let webserver: any;
    let socketServer: any;
    let domainRepository: VisionaryUiDomainRepository;

    const fakeWebServer = {} as Server;

    beforeEach(() => {
        domainRepository = new VisionaryUiDomainRepository();

        webserver = {
            start: sinon.stub(),
            stop: sinon.stub(),
            getServer: () => fakeWebServer,
        };
        socketServer = {
            start: sinon.stub(),
            stop: sinon.stub(),
            registerClientInboundHandler: sinon.stub(),
            messageToClient: sinon.stub(),
            messageToAllClients: sinon.stub(),
        };

        coordinator = new VisionaryUiCoordinator(
            domainRepository,
            webserver as unknown as VisionaryUiWebServer,
            socketServer as VisionaryUiSocketServer,
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Coordinator activation', () => {
        // Test for the start method
        it('should start the coordinator with given adapter handle', async () => {
            // Setup for adapter handle stub
            const adapterHandleStub = {
                setState: sinon.stub(),
                config: {
                    language: 'en',
                    webPort: 3000,
                },
            };
            await coordinator.start(adapterHandleStub);

            sinon.assert.calledOnceWithExactly(webserver.start, 3000);
            sinon.assert.calledOnceWithExactly(socketServer.start, fakeWebServer);
        });

        // Test for the stop method
        it('should stop the coordinator', async () => {
            await coordinator.stop();

            sinon.assert.calledOnce(webserver.stop);
            sinon.assert.calledOnce(socketServer.stop);
        });
    });

    describe('Room management', () => {
        // Test for setting rooms
        it('should set rooms', () => {
            const vuiRoomCache = new VuiCache<VuiRoom>();
            const room = {
                id: 'roomId',
            } as unknown as VuiRoom;
            vuiRoomCache.set(room);
            coordinator.setRooms(vuiRoomCache);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'allRooms', data: [room] }),
            );
        });

        // Test for setting a single room
        it('should set a single room', () => {
            const room = {
                id: 'roomId',
            } as unknown as VuiRoom;
            coordinator.setRoom(room);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify({ type: 'room', data: room }));
        });

        // Test for deleting a room
        it('should delete a room and notify all clients', () => {
            const roomId = 'roomId1';
            coordinator.deleteRoom(roomId);

            // Assuming getRooms() returns the updated state of rooms after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'allRooms', data: domainRepository.getRooms().values() }),
            );
        });
    });

    describe('Function management', () => {
        // Test for setting functions
        it('should set functions', () => {
            const vuiFunctionCache = new VuiCache<VuiFunction>();
            const functionElement = {
                id: 'functionId',
            } as unknown as VuiFunction;
            vuiFunctionCache.set(functionElement);
            coordinator.setFunctions(vuiFunctionCache);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({
                    type: 'allFunctions',
                    data: [functionElement],
                }),
            );
        });

        // Test for setting a single function
        it('should set a single function', () => {
            const functionElement = {
                id: 'functionId',
            } as unknown as VuiFunction;
            coordinator.setFunction(functionElement);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({
                    type: 'function',
                    data: functionElement,
                }),
            );
        });

        // Test for deleting a function
        it('should delete a function and notify all clients', () => {
            const functionId = 'functionId1';
            coordinator.deleteFunction(functionId);

            // Assuming getFunctions() returns the updated state of functions after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'allFunctions', data: domainRepository.getFunctions().values() }),
            );
        });
    });

    describe('Object and state management', () => {
        // Test for setting objects
        it('should set objects', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as VuiRoom;
            coordinator.setRoom(room);
            const vuiFunction = {
                id: 'functionId',
                members: ['objectId'],
            } as unknown as VuiFunction;
            coordinator.setFunction(vuiFunction);
            const vuiStateObjectCache = new VuiCache<VuiStateObject>();
            const vuiStateObject = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateObject;
            vuiStateObjectCache.set(vuiStateObject);
            coordinator.setObjects(vuiStateObjectCache);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({
                    type: 'allStates',
                    data: [vuiStateObject],
                }),
            );
        });

        // Test for setting a single object
        it('should set a single object', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as VuiRoom;
            coordinator.setRoom(room);
            const vuiFunction = {
                id: 'functionId',
                members: ['objectId'],
            } as unknown as VuiFunction;
            coordinator.setFunction(vuiFunction);
            const vuiStateObject = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateObject;
            coordinator.setObject(vuiStateObject);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'state', data: vuiStateObject }),
            );
        });

        // Test for deleting an object
        it('should delete an object and its state, and notify all clients', () => {
            const objectId = 'objectId1';
            coordinator.deleteObject(objectId);

            // Assuming getObjects() and getStates() return the updated states after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'allStates', data: domainRepository.getStateObjects().values() }),
            );
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'allValues', data: domainRepository.getStateValues().values() }),
            );
        });

        // Test for setting states
        it('should set states', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as VuiRoom;
            coordinator.setRoom(room);

            const vuiFunction = {
                id: 'functionId',
                members: ['objectId'],
            } as unknown as VuiFunction;
            coordinator.setFunction(vuiFunction);

            const objectElement = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateObject;
            coordinator.setObject(objectElement);

            sinon.restore();

            const vuiStateValueCache = new VuiCache<VuiStateValue>();
            const stateElement = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateValue;
            vuiStateValueCache.set(stateElement);
            coordinator.setStates(vuiStateValueCache);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({
                    type: 'allValues',
                    data: [stateElement],
                }),
            );
        });

        // Test for setting a single state
        it('should set a single state', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as VuiRoom;
            coordinator.setRoom(room);
            const vuiFunction = {
                id: 'functionId',
                members: ['objectId'],
            } as unknown as VuiFunction;
            coordinator.setFunction(vuiFunction);
            const vuiStateObject = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateObject;
            coordinator.setObject(vuiStateObject);
            const vuiStateValue = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateValue;
            coordinator.setState(vuiStateValue);

            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify({ type: 'state', data: vuiStateValue }),
            );
        });
    });

    describe('Client events', () => {
        // Test for handling client connections
        it('should handle client connection', () => {
            const clientId = 'client1';
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as VuiRoom;
            coordinator.setRoom(room);

            const functionEntry = {
                id: 'functionId',
                members: ['objectId'],
            } as unknown as VuiFunction;
            coordinator.setFunction(functionEntry);

            const objectEntry = {
                id: 'objectId',
                enabled: true,
            } as unknown as VuiStateObject;
            coordinator.setObject(objectEntry);

            const stateEntry = {
                id: 'objectId',
                value: 'value',
            } as unknown as VuiStateValue;
            coordinator.setState(stateEntry);

            coordinator['onClientConnect'](clientId);

            // Verify if appropriate messages are sent to the client
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(0),
                'client1',
                '{"type":"configuration","data":{"language":"en"}}',
            );
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(1),
                'client1',
                '{"type":"allRooms","data":[{"id":"roomId","members":["objectId"]}]}',
            );
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(2),
                'client1',
                '{"type":"allFunctions","data":[{"id":"functionId","members":["objectId"]}]}',
            );
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(3),
                'client1',
                '{"type":"allStates","data":[{"id":"objectId","enabled":true}]}',
            );
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(4),
                'client1',
                '{"type":"allValues","data":[{"id":"objectId","value":"value"}]}',
            );
        });

        // Test for handling messages from client
        it('should handle messages from client', async () => {
            // Setup for adapter handle stub
            const adapterHandleStub = {
                setState: sinon.stub(),
                config: {
                    language: 'en',
                    webPort: 3000,
                },
            };
            await coordinator.start(adapterHandleStub);

            const clientId = 'client1';
            const content: VuiActionEnvelope = {
                type: 'setValues',
                data: [{ id: '0_userdata.0.Lampe.on', value: true }],
            };
            coordinator['onMessageFromClient'](clientId, JSON.stringify(content));

            sinon.assert.calledWith(adapterHandleStub.setState, 'client1', '0_userdata.0.Lampe.on', true);
        });
    });
});
