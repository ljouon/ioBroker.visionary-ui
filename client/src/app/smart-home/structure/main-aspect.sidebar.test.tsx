import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { MainAspectSidebar } from '@/app/smart-home/structure/main-aspect.sidebar';
import { render } from '@/test/testing-library-setup';
import { AspectNode } from '@/app/smart-home/structure/aspect';
import { VuiEnum } from '../../../../../src/domain';

describe('MainAspectSidebar', () => {
    it('renders nodes with main aspects which has children', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                level: 0,
                mainAspect: { name: 'Aspect 1', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 2', icon: 'functionBase64', members: ['objId1'] },
                children: [
                    { mainAspect: { name: 'Child 1', icon: 'functionBase64', members: ['objId1'] } },
                    { mainAspect: { name: 'Child 2', members: ['objId2'] } },
                ],
            },
        ] as unknown as AspectNode<VuiEnum, VuiEnum>[];

        render(<MainAspectSidebar aspectNodes={aspectNodes} onAspectNodeClicked={() => {}} />);

        expect(screen.getByText('Aspect 1')).toBeInTheDocument();
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('renders nodes with main aspects which has state objects', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                level: 0,
                mainAspect: { name: 'Aspect 1', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 2', icon: 'functionBase64', members: ['objId1'] },
                children: [],
            },
        ] as unknown as AspectNode<VuiEnum, VuiEnum>[];

        render(<MainAspectSidebar aspectNodes={aspectNodes} onAspectNodeClicked={() => {}} />);

        expect(screen.getByText('Aspect 1')).toBeInTheDocument();
    });

    it('triggers onAspectNodeClicked when a main aspect is clicked', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                level: 0,
                mainAspect: { name: 'Aspect 1', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 2', icon: 'functionBase64', members: ['objId1'] },
                children: [
                    { mainAspect: { name: 'Child 1', icon: 'functionBase64', members: ['objId1'] } },
                    { mainAspect: { name: 'Child 2', members: ['objId2'] } },
                ],
            },
            {
                canonicalPath: 'path-2',
                level: 0,
                mainAspect: { name: 'Aspect 2', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 3', icon: 'functionBase64', members: ['objId1'] },
                children: [
                    { mainAspect: { name: 'Child 3', icon: 'functionBase64', members: ['objId1'] } },
                    { mainAspect: { name: 'Child 4', members: ['objId2'] } },
                ],
            },
        ] as unknown as AspectNode<VuiEnum, VuiEnum>[];
        const mockOnClick = vi.fn();

        render(<MainAspectSidebar aspectNodes={aspectNodes} onAspectNodeClicked={mockOnClick} />);

        screen.getByText('Aspect 1').click();
        expect(mockOnClick).toHaveBeenCalledWith(aspectNodes[0]);
    });

    it('triggers onAspectNodeClicked when a child aspect is clicked', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                level: 0,
                mainAspect: { name: 'Aspect 1', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 2', icon: 'functionBase64', members: ['objId1'] },
                children: [
                    { mainAspect: { name: 'Child 1', icon: 'functionBase64', members: ['objId1'] } },
                    { mainAspect: { name: 'Child 2', members: ['objId2'] } },
                ],
            },
        ] as unknown as AspectNode<VuiEnum, VuiEnum>[];
        const mockOnClick = vi.fn();

        render(<MainAspectSidebar aspectNodes={aspectNodes} onAspectNodeClicked={mockOnClick} />);

        screen.getByText('Child 1').click();
        expect(mockOnClick).toHaveBeenCalledWith(aspectNodes[0].children[0]);
    });

    it('does not render children if they do not have state objects', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                mainAspect: { name: 'Aspect 1' },
                children: [{ mainAspect: { name: 'Child 1' } }],
            },
        ] as AspectNode<VuiEnum, VuiEnum>[];

        // Assuming hasStateObjects returns false for the children
        render(<MainAspectSidebar aspectNodes={aspectNodes} onAspectNodeClicked={() => {}} />);

        expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    });
});
