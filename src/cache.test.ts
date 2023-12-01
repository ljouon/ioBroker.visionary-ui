import { expect } from 'chai';
import { Cache } from './cache';

class TestCache extends Cache<number> {}

describe('Cache', () => {
    let cache: TestCache;

    beforeEach(() => {
        cache = new TestCache();
    });

    it('should add element to the cache', () => {
        cache.set('testKey', 123);
        expect(cache.get('testKey')).to.equal(123);
    });

    it('should delete element from the cache', () => {
        cache.set('testKey', 123);
        cache.delete('testKey');
        expect(cache.get('testKey')).to.be.undefined;
    });

    it('should return all elements in the cache', () => {
        cache.set('key1', 123);
        cache.set('key2', 456);
        expect(cache.allAll()).to.deep.equal([123, 456]);
    });
});
