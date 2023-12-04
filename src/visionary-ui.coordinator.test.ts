import sinon from 'sinon';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { VisionaryUiWebServer } from './visionary-ui.web';
import { VisionaryUiSocketServer } from './visionary-ui.socket';
import { VisionaryUiDomainRepository } from './visionary-ui.domain.repository';
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

describe('VisionaryUiCoordinator', () => {
    let coordinator: VisionaryUiCoordinator;
    let webserver: any;
    let socketServer: any;
    let domainRepository: VisionaryUiDomainRepository;

    beforeEach(() => {
        domainRepository = new VisionaryUiDomainRepository();

        webserver = {
            start: sinon.stub(),
            stop: sinon.stub(),
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
                    socketPort: 8080,
                },
            };
            await coordinator.start(adapterHandleStub);

            sinon.assert.calledOnceWithExactly(webserver.start, 3000);
            sinon.assert.calledOnceWithExactly(socketServer.start, 8080);
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
            const iobRoomCache = new IobRoomCache();
            const room = {
                id: 'roomId',
            } as unknown as IobRoom;
            iobRoomCache.set(room);
            coordinator.setRooms(iobRoomCache);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify([room]));
        });

        // Test for setting a single room
        it('should set a single room', () => {
            const room = {
                id: 'roomId',
            } as unknown as IobRoom;
            coordinator.setRoom(room);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify(room));
        });

        // Test for deleting a room
        it('should delete a room and notify all clients', () => {
            const roomId = 'roomId1';
            coordinator.deleteRoom(roomId);

            // Assuming getRooms() returns the updated state of rooms after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify(domainRepository.getRooms().values()),
            );
        });
    });

    describe('Function management', () => {
        // Test for setting functions
        it('should set functions', () => {
            const iobFunctionCache = new IobFunctionCache();
            const functionElement = {
                id: 'functionId',
            } as unknown as IobFunction;
            iobFunctionCache.set(functionElement);
            coordinator.setFunctions(iobFunctionCache);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify([functionElement]));
        });

        // Test for setting a single function
        it('should set a single function', () => {
            const functionElement = {
                id: 'functionId',
            } as unknown as IobFunction;
            coordinator.setFunction(functionElement);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify(functionElement));
        });

        // Test for deleting a function
        it('should delete a function and notify all clients', () => {
            const functionId = 'functionId1';
            coordinator.deleteFunction(functionId);

            // Assuming getFunctions() returns the updated state of functions after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify(domainRepository.getFunctions().values()),
            );
        });
    });

    describe('Object and state management', () => {
        // Test for setting objects
        it('should set objects', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as IobRoom;
            coordinator.setRoom(room);
            const iobObjectCache = new IobObjectCache();
            const objectElement = {
                id: 'objectId',
            } as unknown as IobObject;
            iobObjectCache.set(objectElement);
            coordinator.setObjects(iobObjectCache);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify([objectElement]));
        });

        // Test for setting a single object
        it('should set a single object', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as IobRoom;
            coordinator.setRoom(room);

            const objectElement = {
                id: 'objectId',
            } as unknown as IobObject;
            coordinator.setObject(objectElement);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify(objectElement));
        });

        // Test for deleting an object
        it('should delete an object and its state, and notify all clients', () => {
            const objectId = 'objectId1';
            coordinator.deleteObject(objectId);

            // Assuming getObjects() and getStates() return the updated states after deletion
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify(domainRepository.getObjects().values()),
            );
            sinon.assert.calledWith(
                socketServer.messageToAllClients,
                JSON.stringify(domainRepository.getStates().values()),
            );
        });

        // Test for setting states
        it('should set states', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as IobRoom;
            coordinator.setRoom(room);

            const objectElement = {
                id: 'objectId',
            } as unknown as IobObject;
            coordinator.setObject(objectElement);

            sinon.restore();

            const iobStateCache = new IobStateCache();
            const stateElement = {
                id: 'objectId',
            } as unknown as IobState;
            iobStateCache.set(stateElement);
            coordinator.setStates(iobStateCache);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify([stateElement]));
        });

        // Test for setting a single state
        it('should set a single state', () => {
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as IobRoom;
            coordinator.setRoom(room);
            const objectElement = {
                id: 'objectId',
            } as unknown as IobObject;
            coordinator.setObject(objectElement);
            const stateElement = {
                id: 'objectId',
            } as unknown as IobState;
            coordinator.setState(stateElement);

            sinon.assert.calledWith(socketServer.messageToAllClients, JSON.stringify(stateElement));
        });
    });

    describe('Client events', () => {
        // Test for handling client connections
        it('should handle client connection', () => {
            const clientId = 'client1';
            const room = {
                id: 'roomId',
                members: ['objectId'],
            } as unknown as IobRoom;
            coordinator.setRoom(room);

            const functionEntry = {
                id: 'functionId',
            } as unknown as IobFunction;
            coordinator.setFunction(functionEntry);

            const objectEntry = {
                id: 'objectId',
            } as unknown as IobObject;
            coordinator.setObject(objectEntry);

            const stateEntry = {
                id: 'objectId',
                value: 'value',
            } as unknown as IobState;
            coordinator.setState(stateEntry);

            coordinator['onClientConnect'](clientId);

            // Verify if appropriate messages are sent to the client
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(0),
                'client1',
                '[{"id":"roomId","members":["objectId"]}]',
            );
            sinon.assert.calledWithExactly(socketServer.messageToClient.getCall(1), 'client1', '[{"id":"functionId"}]');
            sinon.assert.calledWithExactly(socketServer.messageToClient.getCall(2), 'client1', '[{"id":"objectId"}]');
            sinon.assert.calledWithExactly(
                socketServer.messageToClient.getCall(3),
                'client1',
                '[{"id":"objectId","value":"value"}]',
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
                    socketPort: 8080,
                },
            };
            await coordinator.start(adapterHandleStub);

            const clientId = 'client1';
            const content = 'test message';
            coordinator['onMessageFromClient'](clientId, content);

            sinon.assert.calledWith(adapterHandleStub.setState, 'clientId', '0_userdata.0.Lampe.on', true);
        });
    });
});
