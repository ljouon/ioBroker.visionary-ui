export abstract class Cache<T> {
    private cache: { [key: string]: T } = {};

    get(key: string): T | null {
        return this.cache[key];
    }

    set(key: string, element: T): void {
        this.cache[key] = element;
    }

    allAll(): T[] {
        return Object.values(this.cache);
    }

    delete(key: string): void {
        delete this.cache[key];
    }
}
