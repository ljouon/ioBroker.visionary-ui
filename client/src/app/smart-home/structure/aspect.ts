import { VuiEnum, VuiStateObject } from '../../../../../src/domain';

export type AspectKey = 'rooms' | 'functions';

export function hasChildren(node: AspectNode) {
    return node.children.length > 0;
}

export type AspectNode = {
    level: number;
    canonicalPath: string;
    mainAspect: VuiEnum | null;
    supplementalAspects: VuiEnum[] | null;
    children: AspectNode[];
};

export type StateObject = VuiStateObject & {
    value: string | number | boolean | null;
    lastChange: number | null;
};

export function getPathSegments(id: string, prefix: string): string[] {
    return id.replace(prefix, '').split('.').filter(Boolean);
}

export function buildCanonicalPath(segments: string[], index: number): string {
    return segments.slice(0, index + 1).join('.');
}

export function findAspectNode(nodes: AspectNode[], matcher: (node: AspectNode) => boolean): AspectNode | null {
    let result = null;
    for (const node of nodes) {
        if (node.mainAspect && matcher(node)) {
            result = node;
            break;
        }

        if (node.children.length > 0) {
            const subNode = findAspectNode(node.children, matcher);
            if (subNode) {
                result = subNode;
                break;
            }
        }
    }
    return result;
}

function attachSupplementalElements(mainAspect: VuiEnum, sortedMElements: VuiEnum[]) {
    const result: VuiEnum[] = [];

    if (mainAspect.members) {
        sortedMElements.forEach((m) => {
            if (m.members) {
                const ids = mainAspect.members?.filter((element) => m.members!.includes(element));
                if (ids && ids.length > 0) {
                    result.push({ ...m, members: ids });
                }
            }
        });
    }
    return result;
}

export function createAspectStructure(
    mainAspectElements: VuiEnum[],
    prefix: string,
    supplementalAspectElements: VuiEnum[],
): AspectNode[] {
    const sortedMainElements = mainAspectElements.sort((a, b) => a.id.localeCompare(b.id));
    const sortedMSupplementalElements = supplementalAspectElements.sort((a, b) => a.id.localeCompare(b.id));
    const firstLevelNodes: AspectNode[] = [];

    sortedMainElements.forEach((element) => {
        const pathSegments = getPathSegments(element.id, prefix);
        let currentLevelNodes = firstLevelNodes;

        pathSegments.forEach((_, level) => {
            const isLeaf = level === pathSegments.length - 1;
            const canonicalPath = buildCanonicalPath(pathSegments, level);
            let childNode = currentLevelNodes.find((node) => node.canonicalPath === canonicalPath);
            if (!childNode) {
                childNode = {
                    mainAspect: isLeaf ? element : null,
                    canonicalPath,
                    level,
                    children: [],
                    supplementalAspects: [],
                };
                if (childNode?.mainAspect) {
                    childNode.supplementalAspects =
                        attachSupplementalElements(childNode.mainAspect, sortedMSupplementalElements) ?? null;
                }
                currentLevelNodes.push(childNode);
            }

            currentLevelNodes = childNode.children;
        });
    });
    return firstLevelNodes;
}

export function sortAspectNodesByRank() {
    return (objectA: AspectNode, objectB: AspectNode) => {
        return sortObjectsByRank(objectA.mainAspect, objectB.mainAspect);
    };
}

export function sortObjectsByRank(objectA: { rank: number | null } | null, objectB: { rank: number | null } | null) {
    const rankA = objectA?.rank || 0;
    const rankB = objectB?.rank || 0;
    return rankA > rankB ? 1 : rankA === rankB ? 0 : -1;
}
