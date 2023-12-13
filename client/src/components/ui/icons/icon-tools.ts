import * as mdiIcons from '@mdi/js';

export const isValidIconKey = (key: string): key is keyof typeof mdiIcons => {
    return key in mdiIcons;
};

export function convertIconKeyToMdiFormat(input: string): string {
    const iconKey = input
        .split('-')
        .map((word) => {
            // Capitalize the first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
    return `mdi${iconKey}`;
}
