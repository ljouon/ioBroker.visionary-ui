import { expect } from 'chai';
import {
    VuiFunction,
    VuiFunctionCache,
    VuiRoom,
    VuiRoomCache,
    VuiStateObject,
    VuiStateObjectCache,
    VuiStateValue,
    VuiStateValueCache,
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
            const mockRoomCache = new VuiRoomCache();
            mockRoomCache.set({ id: '1', name: 'Name' } as unknown as VuiRoom);
            repository.setRooms(mockRoomCache);
            expect(repository.getRooms()).to.deep.equal(mockRoomCache);
        });

        it('should add a room correctly', () => {
            const vuiRoom: VuiRoom = { id: '2', name: 'Name' } as unknown as VuiRoom;
            repository.setRoom(vuiRoom);
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
            const vuiRoom: VuiRoom = { id: roomId, name: 'Name' } as unknown as VuiRoom;
            repository.setRoom(vuiRoom);
            expect(repository.getRooms().has(roomId)).to.be.true;
            repository.deleteRoom(roomId);
            expect(repository.getRooms().has(roomId)).to.be.false;
        });
    });

    describe('Function Management', () => {
        it('should add and get multiple functions correctly', () => {
            const mockFunctionCache = new VuiFunctionCache();
            mockFunctionCache.set({ id: '1', name: 'FunctionName' } as unknown as VuiFunction);
            repository.setFunctions(mockFunctionCache);
            expect(repository.getFunctions()).to.deep.equal(mockFunctionCache);
        });

        it('should add a function correctly', () => {
            const vuiFunction: VuiFunction = { id: '2', name: 'FunctionName' } as unknown as VuiFunction;
            repository.setFunction(vuiFunction);
            expect(
                repository
                    .getFunctions()
                    .values()
                    .find((func) => func.id === '2')?.name,
            ).to.be.equal('FunctionName');
        });

        it('should delete a function correctly', () => {
            const functionId = 'someFunctionId';
            const vuiFunction: VuiFunction = { id: functionId, name: 'FunctionName' } as unknown as VuiFunction;
            repository.setFunction(vuiFunction);
            expect(repository.getFunctions().has(functionId)).to.be.true;
            repository.deleteFunction(functionId);
            expect(repository.getFunctions().has(functionId)).to.be.false;
        });
    });

    describe('Object Management', () => {
        it('should add and get multiple objects correctly', () => {
            const mockObjectCache = new VuiStateObjectCache();
            mockObjectCache.set({ id: '1', name: 'ObjectName' } as unknown as VuiStateObject);
            repository.setStateObjects(mockObjectCache);
            expect(repository.getStateObjects()).to.deep.equal(mockObjectCache);
        });

        it('should add an object correctly', () => {
            const vuiStateObject: VuiStateObject = { id: '2', name: 'ObjectName' } as unknown as VuiStateObject;
            repository.setStateObject(vuiStateObject);
            expect(
                repository
                    .getStateObjects()
                    .values()
                    .find((obj) => obj.id === '2')?.name,
            ).to.be.equal('ObjectName');
        });

        it('should delete an object correctly', () => {
            const objectId = 'someObjectId';
            const vuiStateObject: VuiStateObject = { id: objectId, name: 'ObjectName' } as unknown as VuiStateObject;
            repository.setStateObject(vuiStateObject);
            expect(repository.getStateObjects().has(objectId)).to.be.true;
            repository.deleteStateObject(objectId);
            expect(repository.getStateObjects().has(objectId)).to.be.false;
        });
    });

    describe('State Value Management', () => {
        it('should add and get multiple state values correctly', () => {
            const mockStateValueCache = new VuiStateValueCache();
            mockStateValueCache.set({ id: '1', name: 'StateName' } as unknown as VuiStateValue);
            repository.setStateValues(mockStateValueCache);
            expect(repository.getStateValues()).to.deep.equal(mockStateValueCache);
        });

        it('should add a state value correctly', () => {
            const vuiStateValue: VuiStateValue = { id: '2', value: 'value' } as unknown as VuiStateValue;
            repository.setStateValue(vuiStateValue);
            expect(
                repository
                    .getStateValues()
                    .values()
                    .find((state) => state.id === '2')?.value,
            ).to.be.equal('value');
        });

        it('should delete a state correctly', () => {
            const stateId = 'someStateId';
            const vuiStateValue: VuiStateValue = { id: stateId, value: 'value' } as unknown as VuiStateValue;
            repository.setStateValue(vuiStateValue);
            expect(repository.getStateValues().has(stateId)).to.be.true;
            repository.deleteStateValue(stateId);
            expect(repository.getStateValues().has(stateId)).to.be.false;
        });
    });

    describe('isMappedToRoom Method', () => {
        it('should return true if the object is mapped to a room', () => {
            // Erstellen eines Raums und eines Objekts
            const roomId = 'room1';
            const objectId = 'object1';
            const room: VuiRoom = { id: roomId, members: [objectId] } as unknown as VuiRoom;
            const object: VuiStateObject = { id: objectId, name: 'ObjectName' } as unknown as VuiStateObject;

            // Hinzufügen des Raums und des Objekts zum Repository
            repository.setRoom(room);
            repository.setStateObject(object);

            // Testen der isMappedToRoom-Methode
            const isMapped = repository.isMappedToRoom(object);
            expect(isMapped).to.be.true;
        });

        it('should return false if the object is not mapped to any room', () => {
            // Erstellen eines Raums und eines Objekts, die nicht verbunden sind
            const roomId = 'room1';
            const objectId = 'object1';
            const anotherObjectId = 'object2';
            const room: VuiRoom = { id: roomId, members: [anotherObjectId] } as unknown as VuiRoom;
            const object: VuiStateObject = { id: objectId, name: 'ObjectName' } as unknown as VuiStateObject;

            // Hinzufügen des Raums und des Objekts zum Repository
            repository.setRoom(room);
            repository.setStateObject(object);

            // Testen der isMappedToRoom-Methode
            const isMapped = repository.isMappedToRoom(object);
            expect(isMapped).to.be.false;
        });
    });
});
