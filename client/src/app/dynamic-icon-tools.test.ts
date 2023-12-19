import { convertIconKeyToMdiFormat, isValidIconKey } from './dynamic-icon-tools';

describe('icon tools', () => {
    describe('isValidIconKey', () => {
        it('should return true for a valid mdi icon key', () => {
            // Assuming mdiCheck is a valid key in mdiIcons
            const validKey = 'mdiCheck';
            expect(isValidIconKey(validKey)).toBe(true);
        });

        it('should return false for an invalid mdi icon key', () => {
            const invalidKey = 'invalidKey';
            expect(isValidIconKey(invalidKey)).toBe(false);
        });
    });

    describe('convertIconKeyToMdiFormat', () => {
        it('should convert a hyphenated string to mdi format', () => {
            const input = 'home-outline';
            const expectedOutput = 'mdiHomeOutline';
            expect(convertIconKeyToMdiFormat(input)).toBe(expectedOutput);
        });

        it('should handle single word inputs', () => {
            const input = 'home';
            const expectedOutput = 'mdiHome';
            expect(convertIconKeyToMdiFormat(input)).toBe(expectedOutput);
        });

        it('should correctly handle empty strings', () => {
            const input = '';
            const expectedOutput = 'mdi';
            expect(convertIconKeyToMdiFormat(input)).toBe(expectedOutput);
        });
    });
});
