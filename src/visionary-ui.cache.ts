export type WithId = {
    id: string;
};

export class VuiCache<T extends WithId> {
    private cache: { [id: string]: T } = {};

    get(id: string): T | null {
        return this.cache[id] || null;
    }

    set(element: T): void {
        this.cache[element.id] = element;
    }

    has(id: string): boolean {
        return this.get(id) !== null;
    }

    // Find
    find(matcher: (element: T) => boolean): T | undefined {
        const entries = Object.values(this.cache);
        return entries.find((entry) => {
            return matcher(entry);
        });
    }

    values(): T[] {
        return Object.values(this.cache);
    }

    delete(id: string): void {
        delete this.cache[id];
    }

    deleteByFilter(filter: (element: T) => boolean): void {
        const entries = Object.values(this.cache);
        const filter1 = entries.filter((entry) => {
            return filter(entry);
        });
        filter1.forEach((entry) => this.delete(entry.id));
    }

    ids(): string[] {
        return Object.keys(this.cache);
    }
}
