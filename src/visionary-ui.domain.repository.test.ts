import { expect } from 'chai';
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
import { VisionaryUiDomainRepository } from './visionary-ui.domain.repository';

describe('VisionaryUiDomainRepository', () => {
    let repository: VisionaryUiDomainRepository;

    beforeEach(() => {
        repository = new VisionaryUiDomainRepository();
    });

    it('should initialize with default language as en', () => {
        expect(repository['language']).to.equal('en');
    });

    it('should allow setting a new language', () => {
        repository.setLanguage('de');
        expect(repository['language']).to.equal('de');
    });

    describe('Room Management', () => {
        it('should add and get multiple rooms correctly', () => {
            const mockRoomCache = new IobRoomCache();
            mockRoomCache.set({ id: '1', name: 'Name' } as unknown as IobRoom);
            repository.setRooms(mockRoomCache);
            expect(repository.getRooms()).to.deep.equal(mockRoomCache);
        });

        it('should add a room correctly', () => {
            const iobRoom: IobRoom = { id: '2', name: 'Name' } as unknown as IobRoom;
            repository.setRoom(iobRoom);
            // Assume setRoom method adds to the cache
            expect(
                repository
                    .getRooms()
                    .values()
                    .find((room) => room.id === '2')?.name,
            ).to.be.equal('Name');
        });

        it('should delete a room correctly', () => {
            const roomId = 'someRoomId';
            const iobRoom: IobRoom = { id: roomId, name: 'Name' } as unknown as IobRoom;
            repository.setRoom(iobRoom);
            expect(repository.getRooms().has(roomId)).to.be.true;
            repository.deleteRoom(roomId);
            expect(repository.getRooms().has(roomId)).to.be.false;
        });
    });

    describe('Function Management', () => {
        it('should add and get multiple functions correctly', () => {
            const mockFunctionCache = new IobFunctionCache();
            mockFunctionCache.set({ id: '1', name: 'FunctionName' } as unknown as IobFunction);
            repository.setFunctions(mockFunctionCache);
            expect(repository.getFunctions()).to.deep.equal(mockFunctionCache);
        });

        it('should add a function correctly', () => {
            const iobFunction: IobFunction = { id: '2', name: 'FunctionName' } as unknown as IobFunction;
            repository.setFunction(iobFunction);
            expect(
                repository
                    .getFunctions()
                    .values()
                    .find((func) => func.id === '2')?.name,
            ).to.be.equal('FunctionName');
        });

        it('should delete a function correctly', () => {
            const functionId = 'someFunctionId';
            const iobFunction: IobFunction = { id: functionId, name: 'FunctionName' } as unknown as IobFunction;
            repository.setFunction(iobFunction);
            expect(repository.getFunctions().has(functionId)).to.be.true;
            repository.deleteFunction(functionId);
            expect(repository.getFunctions().has(functionId)).to.be.false;
        });
    });

    describe('Object Management', () => {
        it('should add and get multiple objects correctly', () => {
            const mockObjectCache = new IobObjectCache();
            mockObjectCache.set({ id: '1', name: 'ObjectName' } as unknown as IobObject);
            repository.setObjects(mockObjectCache);
            expect(repository.getObjects()).to.deep.equal(mockObjectCache);
        });

        it('should add an object correctly', () => {
            const iobObject: IobObject = { id: '2', name: 'ObjectName' } as unknown as IobObject;
            repository.setObject(iobObject);
            expect(
                repository
                    .getObjects()
                    .values()
                    .find((obj) => obj.id === '2')?.name,
            ).to.be.equal('ObjectName');
        });

        it('should delete an object correctly', () => {
            const objectId = 'someObjectId';
            const iobObject: IobObject = { id: objectId, name: 'ObjectName' } as unknown as IobObject;
            repository.setObject(iobObject);
            expect(repository.getObjects().has(objectId)).to.be.true;
            repository.deleteObject(objectId);
            expect(repository.getObjects().has(objectId)).to.be.false;
        });
    });

    describe('State Management', () => {
        it('should add and get multiple states correctly', () => {
            const mockStateCache = new IobStateCache();
            mockStateCache.set({ id: '1', name: 'StateName' } as unknown as IobState);
            repository.setStates(mockStateCache);
            expect(repository.getStates()).to.deep.equal(mockStateCache);
        });

        it('should add a state correctly', () => {
            const iobState: IobState = { id: '2', value: 'value' } as unknown as IobState;
            repository.setState(iobState);
            expect(
                repository
                    .getStates()
                    .values()
                    .find((state) => state.id === '2')?.value,
            ).to.be.equal('value');
        });

        it('should delete a state correctly', () => {
            const stateId = 'someStateId';
            const iobState: IobState = { id: stateId, value: 'value' } as unknown as IobState;
            repository.setState(iobState);
            expect(repository.getStates().has(stateId)).to.be.true;
            repository.deleteState(stateId);
            expect(repository.getStates().has(stateId)).to.be.false;
        });
    });

    describe('isMappedToRoom Method', () => {
        it('should return true if the object is mapped to a room', () => {
            // Erstellen eines Raums und eines Objekts
            const roomId = 'room1';
            const objectId = 'object1';
            const room: IobRoom = { id: roomId, members: [objectId] } as unknown as IobRoom;
            const object: IobObject = { id: objectId, name: 'ObjectName' } as unknown as IobObject;

            // Hinzufügen des Raums und des Objekts zum Repository
            repository.setRoom(room);
            repository.setObject(object);

            // Testen der isMappedToRoom-Methode
            const isMapped = repository.isMappedToRoom(object);
            expect(isMapped).to.be.true;
        });

        it('should return false if the object is not mapped to any room', () => {
            // Erstellen eines Raums und eines Objekts, die nicht verbunden sind
            const roomId = 'room1';
            const objectId = 'object1';
            const anotherObjectId = 'object2';
            const room: IobRoom = { id: roomId, members: [anotherObjectId] } as unknown as IobRoom;
            const object: IobObject = { id: objectId, name: 'ObjectName' } as unknown as IobObject;

            // Hinzufügen des Raums und des Objekts zum Repository
            repository.setRoom(room);
            repository.setObject(object);

            // Testen der isMappedToRoom-Methode
            const isMapped = repository.isMappedToRoom(object);
            expect(isMapped).to.be.false;
        });
    });
});
