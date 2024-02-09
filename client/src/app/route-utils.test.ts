import {createAspectPath, encodePath, matchPath} from "@/app/route-utils";

describe('route-utils', () => {
    describe('encodePath', () => {
        it('should encode a given path to lowercase', () => {
            const encoded = encodePath('/Test/Path');
            expect(encoded).toBe('/test/path');
        });

        it('should encode a given path to lowercase and be idempotent', () => {
            const encoded = encodePath('/test/path');
            expect(encoded).toBe('/test/path');
        });
    });

    describe('matchPath', () => {
        it('should match encodedPath with path ignoring case sensitivity', () => {
            const encodedPath = encodePath('/test/path');
            const path = '/Test/Path';
            expect(matchPath(encodedPath, path)).toBe(true);
        });

        it('should not match encodedPath with different path', () => {
            const encodedPath = encodePath('/test/path');
            const path = '/other/path';
            expect(matchPath(encodedPath, path)).toBe(false);
        });
    });

    describe('createAspectPath', () => {
        it('should create aspect path with aspectKey and canonicalPath', () => {
            const createdPath = createAspectPath('aspect', 'Test/Pa th');
            expect(createdPath).toBe(`/aspect/test/pa%20th`);
        });
    });

})

