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

export class VisionaryUiDomainRepository {
    private language: string = 'en';
    private rooms: IobRoomCache = new IobRoomCache();
    private functions: IobFunctionCache = new IobFunctionCache();
    private objects: IobObjectCache = new IobObjectCache();
    private states: IobStateCache = new IobStateCache();

    constructor() {}

    setLanguage(language: string): void {
        this.language = language;
    }

    getRooms(): IobRoomCache {
        return this.rooms;
    }

    setRooms(elements: IobRoomCache): void {
        this.rooms = elements;
    }

    setRoom(element: IobRoom): void {
        this.rooms.set(element);
    }

    getFunctions(): IobFunctionCache {
        return this.functions;
    }

    setFunctions(elements: IobFunctionCache): void {
        this.functions = elements;
    }

    setFunction(element: IobFunction): void {
        this.functions.set(element);
    }

    getObjects(): IobObjectCache {
        return this.objects;
    }

    deleteObject(id: string): void {
        this.objects.delete(id);
        this.states.delete(id);
    }

    setObjects(elements: IobObjectCache): void {
        this.objects = elements;
    }

    setObject(element: IobObject): void {
        this.objects.set(element);
    }

    getStates(): IobStateCache {
        return this.states;
    }

    setStates(elements: IobStateCache): void {
        this.states = elements;
    }

    setState(element: IobState): void {
        this.states.set(element);
    }

    isMappedToRoom(object: IobObject): boolean {
        const values = this.rooms.values().map((room) => room.members?.includes(object.id) || false);
        return values.includes(true);
    }

    deleteRoom(id: string): void {
        this.rooms.delete(id);
    }

    deleteFunction(id: string): void {
        this.functions.delete(id);
    }

    deleteState(id: string): void {
        this.states.delete(id);
    }
}
