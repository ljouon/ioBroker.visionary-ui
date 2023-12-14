import { VuiEnum, VuiStateObject } from '../../../src/domain';

export type TreeNode<T, S> = {
    level: number;
    canonicalPath: string;
    basisData: T | null;
    matchingData: S[] | null;
    children: TreeNode<T, S>[];
};

export type UiStateObject = VuiStateObject & {
    value: string | number | boolean | null;
    lastChange: number | null;
};

export function getPathSegments(id: string, prefix: string): string[] {
    return id.replace(prefix, '').split('.').filter(Boolean);
}

export function buildCanonicalPath(segments: string[], index: number): string {
    return segments.slice(0, index + 1).join('.');
}

function attachMatchingElements<T extends VuiEnum, S extends VuiEnum>(basisData: T, sortedMElements: S[]) {
    const result: S[] = [];

    if (basisData.members) {
        sortedMElements.forEach((m) => {
            if (m.members) {
                const ids = basisData.members?.filter((element) => m.members!.includes(element));
                if (ids && ids.length > 0) {
                    result.push({ ...m, members: ids });
                }
            }
        });
    }
    return result;
}

export function createStructure<T extends VuiEnum, S extends VuiEnum>(
    baseElements: T[],
    prefix: string,
    matchingElements: S[],
): TreeNode<T, S>[] {
    const sortedBElements = baseElements.sort((a, b) => a.id.localeCompare(b.id));
    const sortedMElements = matchingElements.sort((a, b) => a.id.localeCompare(b.id));
    const firstLevelNodes: TreeNode<T, S>[] = [];

    sortedBElements.forEach((element) => {
        const pathSegments = getPathSegments(element.id, prefix);
        let currentLevelNodes = firstLevelNodes;

        pathSegments.forEach((_, level) => {
            const isLeaf = level === pathSegments.length - 1;
            const canonicalPath = buildCanonicalPath(pathSegments, level);
            let childNode = currentLevelNodes.find((node) => node.canonicalPath === canonicalPath);
            if (!childNode) {
                childNode = {
                    basisData: isLeaf ? element : null,
                    canonicalPath,
                    level,
                    children: [],
                    matchingData: [],
                };
                if (childNode.basisData) {
                    childNode.matchingData = attachMatchingElements(childNode.basisData, sortedMElements) ?? null;
                }
                currentLevelNodes.push(childNode);
            }

            currentLevelNodes = childNode.children;
        });
    });

    return firstLevelNodes;
}
