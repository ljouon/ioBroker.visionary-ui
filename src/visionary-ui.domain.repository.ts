import {
    IobFunction,
    IobFunctionCache,
    IobObject,
    IobObjectCache,
    IobRoleCache,
    IobRoom,
    IobRoomCache,
    IobState,
    IobStateCache,
} from './domain';

export class VisionaryUiDomainRepository {
    private language: string = 'en';
    private rooms: IobRoomCache = new IobRoomCache();
    private functions: IobFunctionCache = new IobFunctionCache();
    private roles: IobRoleCache = new IobRoleCache();
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
        this.rooms.set(element.id, element);
    }

    getFunctions(): IobFunctionCache {
        return this.functions;
    }

    setFunctions(elements: IobFunctionCache): void {
        this.functions = elements;
    }

    setFunction(element: IobFunction): void {
        this.functions.set(element.id, element);
    }

    getRoles(): IobRoleCache {
        return this.roles;
    }

    setRoles(elements: IobRoleCache): void {
        this.roles = elements;
    }

    getObjects(): IobObjectCache {
        return this.objects;
    }

    hasObject(id: string): boolean {
        return this.objects.has(id);
    }

    deleteObject(id: string): void {
        this.objects.delete(id);
        this.states.delete(id);
    }

    setObjects(elements: IobObjectCache): void {
        this.objects = elements;
    }

    setObject(element: IobObject): void {
        this.objects.set(element.id, element);
    }

    getStates(): IobStateCache {
        return this.states;
    }

    setStates(elements: IobStateCache): void {
        this.states = elements;
    }

    setState(element: IobState): void {
        this.states.set(element.id, element);
    }

    isMappedToRoom(object: IobObject): boolean {
        const values = this.rooms.values().map((room) => room.members?.includes(object.id) || false);
        return values.includes(true);
    }
}
