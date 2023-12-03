export abstract class Cache<T> {
    private cache: { [key: string]: T } = {};

    get(key: string): T | null {
        return this.cache[key] || null;
    }

    set(key: string, element: T): void {
        this.cache[key] = element;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    // Find
    find(matcher: (element: T) => boolean): [string, T] | undefined {
        const entries = Object.entries(this.cache);
        return entries.find((entry) => {
            return matcher(entry[1]);
        });
    }

    values(): T[] {
        return Object.values(this.cache);
    }

    delete(key: string): void {
        delete this.cache[key];
    }

    deleteByFilter(filter: (element: T) => boolean): void {
        const entries = Object.entries(this.cache);
        const filter1 = entries.filter((entry) => {
            return filter(entry[1]);
        });
        filter1.forEach((entry) => this.delete(entry[0]));
    }

    keys(): string[] {
        return Object.keys(this.cache);
    }
}
