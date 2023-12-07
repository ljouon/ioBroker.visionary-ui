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

export class VisionaryUiDomainRepository {
    private language: string = 'en';
    private rooms: VuiRoomCache = new VuiRoomCache();
    private functions: VuiFunctionCache = new VuiFunctionCache();
    private stateObjectCache: VuiStateObjectCache = new VuiStateObjectCache();
    private stateValueCache: VuiStateValueCache = new VuiStateValueCache();

    constructor() {}

    setLanguage(language: string): void {
        this.language = language;
    }

    getRooms(): VuiRoomCache {
        return this.rooms;
    }

    setRooms(elements: VuiRoomCache): void {
        this.rooms = elements;
    }

    setRoom(element: VuiRoom): void {
        this.rooms.set(element);
    }

    deleteRoom(id: string): void {
        this.rooms.delete(id);
    }

    getFunctions(): VuiFunctionCache {
        return this.functions;
    }

    setFunctions(elements: VuiFunctionCache): void {
        this.functions = elements;
    }

    setFunction(element: VuiFunction): void {
        this.functions.set(element);
    }

    deleteFunction(id: string): void {
        this.functions.delete(id);
    }

    getStateObjects(): VuiStateObjectCache {
        return this.stateObjectCache;
    }

    deleteStateObject(id: string): void {
        this.stateObjectCache.delete(id);
        this.stateValueCache.delete(id);
    }

    setStateObjects(elements: VuiStateObjectCache): void {
        this.stateObjectCache = elements;
    }

    setStateObject(element: VuiStateObject): void {
        this.stateObjectCache.set(element);
    }

    getStateValues(): VuiStateValueCache {
        return this.stateValueCache;
    }

    setStateValues(elements: VuiStateValueCache): void {
        this.stateValueCache = elements;
    }

    setStateValue(element: VuiStateValue): void {
        this.stateValueCache.set(element);
    }

    deleteStateValue(id: string): void {
        this.stateValueCache.delete(id);
    }

    isMappedToRoom(object: VuiStateObject): boolean {
        const values = this.rooms.values().map((room) => room.members?.includes(object.id) || false);
        return values.includes(true);
    }
}
