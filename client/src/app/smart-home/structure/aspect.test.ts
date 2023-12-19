import { describe, expect, it } from 'vitest';
import {
    AspectNode,
    buildCanonicalPath,
    createAspectStructure,
    getPathSegments,
    hasChildren,
} from '@/app/smart-home/structure/aspect';
import { VuiEnum } from '../../../../../src/domain';

describe('hasChildren Function', () => {
    it('returns true if node has children', () => {
        const node: AspectNode<VuiEnum, VuiEnum> = {
            level: 0,
            canonicalPath: 'path',
            mainAspect: null,
            supplementalAspects: null,
            children: [{} as AspectNode<VuiEnum, VuiEnum>],
        };
        expect(hasChildren(node)).toBe(true);
    });

    it('returns false if node has no children', () => {
        const node: AspectNode<VuiEnum, VuiEnum> = {
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
        const mainAspects: VuiEnum[] = [{ id: 'prefix.segment1', members: ['object1'] }] as VuiEnum[];
        const supplementalAspects: VuiEnum[] = [{ id: 'supplemental1', members: ['object1'] }] as VuiEnum[];
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
});
