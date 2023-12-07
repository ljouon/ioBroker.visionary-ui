import { expect } from 'chai';
import { VuiCache } from './visionary-ui.cache';

describe('Cache class', () => {
    class TestCache extends VuiCache<{ id: string; data: string }> {}

    let cache: TestCache;
    beforeEach(() => {
        cache = new TestCache();
    });

    it('should add elements with set and retrieve them with get', () => {
        cache.set({ id: '1', data: 'test' });
        const element = cache.get('1');

        expect(element).to.deep.equal({ id: '1', data: 'test' });
    });

    it('should determine if an item exists with has()', () => {
        cache.set({ id: '1', data: 'test' });
        const hasItem = cache.has('1');

        expect(hasItem).to.be.true;
    });

    it('should delete an item with delete()', () => {
        cache.set({ id: '1', data: 'test' });
        cache.delete('1');

        const hasItem = cache.has('1');
        expect(hasItem).to.be.false;
    });

    it('should find an item with find()', () => {
        cache.set({ id: '1', data: 'test' });
        const item = cache.find((element) => element.data === 'test');

        expect(item).to.deep.equal({ id: '1', data: 'test' });
    });

    it('should return all values with values()', () => {
        cache.set({ id: '1', data: 'test' });
        const values = cache.values();

        expect(values).to.deep.equal([{ id: '1', data: 'test' }]);
    });

    it('should delete by filter with deleteByFilter()', () => {
        cache.set({ id: '1', data: 'test1' });
        cache.set({ id: '2', data: 'test2' });

        cache.deleteByFilter((item) => item.data === 'test1');
        const hasItem = cache.has('1');

        expect(hasItem).to.be.false;
    });

    it('should return all ids with ids()', () => {
        cache.set({ id: '1', data: 'test' });
        cache.set({ id: '2', data: 'another test' });

        const ids = cache.ids();

        expect(ids).to.deep.equal(['1', '2']);
    });
});
