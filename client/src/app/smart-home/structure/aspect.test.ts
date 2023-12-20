import {describe, expect, it} from 'vitest';
import {
    AspectNode,
    buildCanonicalPath,
    createAspectStructure,
    findAspectNode,
    getPathSegments,
    hasChildren,
} from '@/app/smart-home/structure/aspect';
import {VuiEnum} from '../../../../../src/domain';

describe('hasChildren Function', () => {
    it('returns true if node has children', () => {
        const node: AspectNode = {
            level: 0,
            canonicalPath: 'path',
            mainAspect: null,
            supplementalAspects: null,
            children: [{} as AspectNode],
        };
        expect(hasChildren(node)).toBe(true);
    });

    it('returns false if node has no children', () => {
        const node: AspectNode = {
            level: 0,
            canonicalPath: 'path',
            mainAspect: null,
            supplementalAspects: null,
            children: [],
        };
        expect(hasChildren(node)).toBe(false);
    });
});

describe('getPathSegments Function', () => {
    it('returns path segments', () => {
        const id = 'prefix.segment1.segment2';
        const prefix = 'prefix.';
        expect(getPathSegments(id, prefix)).toEqual(['segment1', 'segment2']);
    });
});

describe('buildCanonicalPath Function', () => {
    it('builds a canonical path from segments', () => {
        const segments = ['segment1', 'segment2', 'segment3'];
        const index = 1;
        expect(buildCanonicalPath(segments, index)).toBe('segment1.segment2');
    });
});

describe('createAspectStructure Function', () => {
    it('creates aspect structure from main and supplemental aspects', () => {
        const mainAspects: VuiEnum[] = [{id: 'prefix.segment1', members: ['object1']}] as VuiEnum[];
        const supplementalAspects: VuiEnum[] = [{id: 'supplemental1', members: ['object1']}] as VuiEnum[];
        const structure = createAspectStructure(mainAspects, 'prefix.', supplementalAspects);

        expect(structure.length).toBeGreaterThan(0);
        expect(structure[0].canonicalPath).toBe('segment1');

        expect(structure[0].mainAspect).not.toBeNull();
        expect(structure[0].mainAspect!.id).toBe('prefix.segment1');
        expect(structure[0].mainAspect!.members!.length).toBe(1);
        expect(structure[0].mainAspect!.members![0]).toBe('object1');

        expect(structure[0].supplementalAspects).not.toBeNull();
        expect(structure[0].supplementalAspects!.length).toBe(1);
        expect(structure[0].supplementalAspects![0].id).toBe('supplemental1');
        expect(structure[0].supplementalAspects![0].members!.length).toBe(1);
        expect(structure[0].supplementalAspects![0].members![0]).toBe('object1');
    });

    it('creates hierarchical aspect structure with child nodes', () => {
        const mainAspects = [
            {id: 'prefix.room1', members: []},
            {id: 'prefix.room1.child1', members: []},
            {id: 'prefix.room2', members: []},
            {id: 'prefix.room2.child1', members: []},
            {id: 'prefix.room3.child2', members: []},
        ] as unknown as VuiEnum[];
        const supplementalAspects = [] as VuiEnum[];

        const structure = createAspectStructure(mainAspects, 'prefix.', supplementalAspects);

        expect(structure).toHaveLength(3); // Two top-level nodes: room1 and room2
        expect(structure[0].children).toHaveLength(1); // room1 has 1 child
        expect(structure[1].children).toHaveLength(1); // room2 has 2 children
        expect(structure[0].children[0].canonicalPath).toBe('room1.child1');
        expect(structure[1].children[0].canonicalPath).toBe('room2.child1');
        expect(structure[2].children[0].canonicalPath).toBe('room3.child2');
    });

    it('creates aspect structure from main and supplemental aspects', () => {
        const mainAspects: VuiEnum[] = [{id: 'prefix.segment1', members: ['object1']}] as VuiEnum[];
        const supplementalAspects: VuiEnum[] = [{id: 'supplemental1', members: ['object2']}] as VuiEnum[];
        const structure = createAspectStructure(mainAspects, 'prefix.', supplementalAspects);

        expect(structure.length).toBeGreaterThan(0);
        expect(structure[0].canonicalPath).toBe('segment1');

        expect(structure[0].mainAspect).not.toBeNull();
        expect(structure[0].mainAspect!.id).toBe('prefix.segment1');
        expect(structure[0].mainAspect!.members!.length).toBe(1);
        expect(structure[0].mainAspect!.members![0]).toBe('object1');

        expect(structure[0].supplementalAspects).not.toBeNull();
        expect(structure[0].supplementalAspects!.length).toBe(0);
    });

    it('does not attach supplemental elements when no members match', () => {
        const mainAspects = [{id: 'prefix.room1', members: ['object3']}] as VuiEnum[];
        const supplementalAspects = [
            {id: 'supplemental1', members: ['object1']},
            {id: 'supplemental2', members: ['object2']},
        ] as VuiEnum[];

        const structure = createAspectStructure(mainAspects, 'prefix.', supplementalAspects);

        expect(structure).toHaveLength(1);
        expect(structure[0].supplementalAspects).toHaveLength(0);
    });
});

describe('findAspectNode', () => {

    const roomAspectNodes = [
        {
            canonicalPath: 'path-1',
            level: 0,
            mainAspect: {name: 'Room 1', icon: 'roomBase64', members: ['objId1']},
            supplementalAspects: {name: 'Function 1', icon: 'functionBase64', members: ['objId1']},
            children: [
                {
                    mainAspect: {
                        name: 'Room 1-1',
                        icon: 'functionBase64',
                        members: ['objId1']
                    },
                    canonicalPath: 'path-1.child-1',
                    children: []
                },
                {mainAspect: {name: 'Room 1-2', members: ['objId2']}, children: [], canonicalPath: 'path-1.child-2'},
            ],
        },
    ] as unknown as AspectNode[];

    it('findAspectNode should find the correct node', () => {
        const matcher = (node: AspectNode) => node.canonicalPath === 'path-1.child-2';
        expect(findAspectNode(roomAspectNodes, matcher)).toBe(roomAspectNodes[0].children[1]);
    });

    it('returns null when no matching node is found', () => {
        const matcher = (node: AspectNode) => node.canonicalPath === 'non-existing-path';
        expect(findAspectNode(roomAspectNodes, matcher)).toBeNull();
    });
})

