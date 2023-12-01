import { IobFunction, IobObject, IobObjectCache, IobRole, IobRoom, IobState, IobStateCache } from './domain';

export class VisionaryUiRepository {
    private language: string = 'en';
    private rooms: IobRoom[] = [];
    private functions: IobFunction[] = [];
    private roles: IobRole[] = [];
    private objects: IobObjectCache = new IobObjectCache();
    private states: IobStateCache = new IobStateCache();

    constructor() {}

    setLanguage(language: string): void {
        this.language = language;
    }

    getRooms(): IobRoom[] {
        return this.rooms;
    }

    setRooms(elements: IobRoom[]): void {
        this.rooms = elements;
    }

    getFunctions(): IobFunction[] {
        return this.functions;
    }

    setFunctions(elements: IobFunction[]) {
        this.functions = elements;
    }

    getRoles(): IobRole[] {
        return this.roles;
    }

    setRoles(elements: IobRole[]): void {
        this.roles = elements;
    }

    getObjects(): IobObjectCache {
        return this.objects;
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
}
