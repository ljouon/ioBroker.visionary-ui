import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import { render } from '@/test/testing-library-setup';
import { MainAspectSidebar } from '@/app/smart-home/structure/main-aspect-sidebar';
import { fireEvent, screen } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVuiDataContext, VuiDataContextType } from '@/app/smart-home/data.context';
import { AspectNode } from '@/app/smart-home/structure/aspect';

vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    generatePath: vi.fn(),
}));

const roomAspectNodes = [
    {
        canonicalPath: 'path-1',
        level: 0,
        mainAspect: { name: 'Room 1', icon: 'roomBase64', members: ['objId1'] },
        supplementalAspects: { name: 'Function 1', icon: 'functionBase64', members: ['objId1'] },
        children: [
            { mainAspect: { name: 'Room 1-1', icon: 'functionBase64', members: ['objId1'] } },
            { mainAspect: { name: 'Room 1-2', members: ['objId2'] } },
        ],
    },
] as unknown as AspectNode[];
const functionAspectNodes = [
    {
        canonicalPath: 'path-2',
        level: 0,
        mainAspect: { name: 'Function 2', icon: 'roomBase64', members: ['objId1'] },
        supplementalAspects: { name: 'Room 1', icon: 'functionBase64', members: ['objId1'] },
        children: [
            { mainAspect: { name: 'Function 2-1', icon: 'functionBase64', members: ['objId1'] } },
            { mainAspect: { name: 'Function 2-2', members: ['objId2'] } },
        ],
    },
] as unknown as AspectNode[];

describe('MainAspectSidebar', () => {
    beforeEach(() => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms' });
        vi.mocked(useVuiDataContext).mockReturnValue({
            roomAspectNodes: roomAspectNodes,
            functionAspectNodes: functionAspectNodes,
        } as unknown as VuiDataContextType);

        vi.mocked(useNavigate).mockReturnValue(() => {
            vi.fn();
        });
    });

    it('renders room aspect nodes by default', () => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: undefined });
        render(<MainAspectSidebar closeSheet={vi.fn()} />);

        expect(screen.getByText('Room 1')).toBeInTheDocument();
        expect(screen.getByText('Room 1-1')).toBeInTheDocument();
        expect(screen.getByText('Room 1-2')).toBeInTheDocument();
        expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('renders room aspect nodes if useParams return rooms', () => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms' });
        render(<MainAspectSidebar closeSheet={vi.fn()} />);

        expect(screen.getByText('Room 1')).toBeInTheDocument();
        expect(screen.getByText('Room 1-1')).toBeInTheDocument();
        expect(screen.getByText('Room 1-2')).toBeInTheDocument();
        expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('renders function aspect nodes if useParams return functions', () => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'functions' });
        render(<MainAspectSidebar closeSheet={vi.fn()} />);

        expect(screen.getByText('Function 2')).toBeInTheDocument();
        expect(screen.getByText('Function 2-1')).toBeInTheDocument();
        expect(screen.getByText('Function 2-2')).toBeInTheDocument();
        expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('switches to function aspect nodes when the toggle is switched', () => {
        render(<MainAspectSidebar closeSheet={vi.fn()} />);
        const toggleSwitch = screen.getByText('Functions');
        fireEvent.click(toggleSwitch);

        expect(screen.getByText('Function 2')).toBeInTheDocument();
        expect(screen.getByText('Function 2-1')).toBeInTheDocument();
        expect(screen.getByText('Function 2-2')).toBeInTheDocument();
    });

    it('navigates and closes the sheet when a main menu item is clicked', () => {
        const mockCloseSheet = vi.fn();
        render(<MainAspectSidebar closeSheet={mockCloseSheet} />);

        const mainMenuItem = screen.getByText('Room 1');
        fireEvent.click(mainMenuItem);

        expect(useNavigate).toHaveBeenCalled();
        expect(mockCloseSheet).toHaveBeenCalled();
    });

    it('renders room aspect nodes if they have objects', () => {
        const aspectNodes = [
            {
                canonicalPath: 'path-1',
                level: 0,
                mainAspect: { name: 'Aspect 1', icon: 'roomBase64', members: ['objId1'] },
                supplementalAspects: { name: 'Aspect 2', icon: 'functionBase64', members: ['objId1'] },
                children: [],
            },
        ] as unknown as AspectNode[];

        vi.mocked(useVuiDataContext).mockReturnValue({
            roomAspectNodes: aspectNodes,
            functionAspectNodes: [],
        } as unknown as VuiDataContextType);

        render(<MainAspectSidebar closeSheet={vi.fn()} />);

        expect(screen.getByText('Aspect 1')).toBeInTheDocument();
    });
});
