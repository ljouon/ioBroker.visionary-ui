import { VuiFunction, VuiRoom, VuiStateObject, VuiStateValue } from './domain';
import { VuiCache } from './visionary-ui.cache';

export class VisionaryUiDomainRepository {
    private language: string = 'en';
    private rooms: VuiCache<VuiRoom> = new VuiCache<VuiRoom>();
    private functions: VuiCache<VuiFunction> = new VuiCache<VuiFunction>();
    private stateObjectCache: VuiCache<VuiStateObject> = new VuiCache<VuiStateObject>();
    private stateValueCache: VuiCache<VuiStateValue> = new VuiCache<VuiStateValue>();

    constructor() {}

    setLanguage(language: string): void {
        this.language = language;
    }

    getRooms(): VuiCache<VuiRoom> {
        return this.rooms;
    }

    setRooms(elements: VuiCache<VuiRoom>): void {
        this.rooms = elements;
    }

    setRoom(element: VuiRoom): void {
        this.rooms.set(element);
    }

    deleteRoom(id: string): void {
        this.rooms.delete(id);
    }

    getFunctions(): VuiCache<VuiFunction> {
        return this.functions;
    }

    setFunctions(elements: VuiCache<VuiFunction>): void {
        this.functions = elements;
    }

    setFunction(element: VuiFunction): void {
        this.functions.set(element);
    }

    deleteFunction(id: string): void {
        this.functions.delete(id);
    }

    getStateObjects(): VuiCache<VuiStateObject> {
        return this.stateObjectCache;
    }

    deleteStateObject(id: string): void {
        this.stateObjectCache.delete(id);
        this.stateValueCache.delete(id);
    }

    setStateObjects(elements: VuiCache<VuiStateObject>): void {
        this.stateObjectCache = elements;
    }

    setStateObject(element: VuiStateObject): void {
        this.stateObjectCache.set(element);
    }

    getStateValues(): VuiCache<VuiStateValue> {
        return this.stateValueCache;
    }

    setStateValues(elements: VuiCache<VuiStateValue>): void {
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
