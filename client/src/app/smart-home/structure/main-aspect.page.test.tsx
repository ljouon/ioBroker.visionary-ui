import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { useVuiDataContext, VuiDataContextType } from '@/app/smart-home/data.context';
import { render, screen } from '@/test/testing-library-setup';
import { MainAspectPage } from '@/app/smart-home/structure/main-aspect.page';
import { useParams } from 'react-router-dom';
import { AspectNode, findAspectNode } from '@/app/smart-home/structure/aspect';

vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
}));
vi.mock('@/app/smart-home/structure/aspect', () => ({
    findAspectNode: vi.fn(),
}));
vi.mock('@/app/components/error', () => ({
    ErrorDisplay: () => <div>ErrorDisplay</div>,
}));
vi.mock('@/app/smart-home/structure/main-aspect.section', () => ({
    MainAspectSection: () => <div>MainAspectSection</div>,
}));

describe('MainAspectPage Component', () => {
    it('displays error if connection state is not OPEN', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({ connectionState: 'CLOSED' } as unknown as VuiDataContextType);
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms', canonicalPath: 'aspect1' });
        render(<MainAspectPage />);
        expect(screen.getByText('ErrorDisplay')).toBeInTheDocument();
    });

    it('displays error if no aspect node is selected', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'OPEN',
            roomAspectNodes: [],
            functionAspectNodes: [],
        } as unknown as VuiDataContextType);
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms', canonicalPath: '' });
        render(<MainAspectPage />);
        expect(screen.getByText('ErrorDisplay')).toBeInTheDocument();
    });

    it('displays MainAspectSection for each main aspect', () => {
        const mockAspects = [
            { id: 'aspect1', level: 0, canonicalPath: 'aspect1' },
            { id: 'aspect2', level: 1, canonicalPath: 'aspect2' },
        ];
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms', canonicalPath: 'aspect1' });
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'OPEN',
            roomAspectNodes: mockAspects,
            functionAspectNodes: vi.fn(),
        } as unknown as VuiDataContextType);
        vi.mocked(findAspectNode).mockReturnValue({
            id: 'aspect1',
            level: 0,
            canonicalPath: 'aspect1',
            children: [],
            mainAspect: {},
        } as unknown as AspectNode);

        render(<MainAspectPage />);

        expect(screen.getAllByText('MainAspectSection')).toHaveLength(1);
    });

    it('returns empty array for node with level >= 2', () => {
        const deepNode: AspectNode = {
            level: 2,
            canonicalPath: 'aspect1.child1',
            mainAspect: { id: 'deepAspect', members: [] },
            children: [],
        } as unknown as AspectNode;
        vi.mocked(findAspectNode).mockReturnValue(deepNode);

        render(<MainAspectPage />);
        expect(screen.queryByText('MainAspectSection')).not.toBeInTheDocument();
    });

    it('returns mainAspect and children for node with valid children for rooms', () => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'rooms', canonicalPath: 'aspect1' });
        const mockAspects = [
            { id: 'aspect1', level: 0, canonicalPath: 'aspect1' },
            { id: 'aspect2', level: 1, canonicalPath: 'aspect2' },
        ];
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'OPEN',
            roomAspectNodes: mockAspects,
            functionAspectNodes: mockAspects,
        } as unknown as VuiDataContextType);
        const parentNode = {
            id: 'aspect1',
            level: 0,
            canonicalPath: 'aspect1',
            children: [
                { mainAspect: { id: 'childAspect1', members: ['object1'], type: 'room' }, children: [] },
                { mainAspect: { id: 'childAspect2', members: ['object1'], type: 'room' }, children: [] },
            ],
            mainAspect: { id: 'parentAspect', members: ['object1'] },
        } as unknown as AspectNode;
        vi.mocked(findAspectNode).mockReturnValue(parentNode);

        render(<MainAspectPage />);
        expect(screen.getAllByText('MainAspectSection')).toHaveLength(3); // Parent + 2 children
    });

    it('returns mainAspect and children for node with valid children for functions', () => {
        vi.mocked(useParams).mockReturnValue({ mainAspect: 'functions', canonicalPath: 'aspect1' });
        const mockAspects = [
            { id: 'aspect1', level: 0, canonicalPath: 'aspect1' },
            { id: 'aspect2', level: 1, canonicalPath: 'aspect2' },
        ];
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'OPEN',
            roomAspectNodes: mockAspects,
            functionAspectNodes: mockAspects,
        } as unknown as VuiDataContextType);
        const parentNode = {
            id: 'aspect1',
            level: 0,
            canonicalPath: 'aspect1',
            children: [
                { mainAspect: { id: 'childAspect1', members: ['object1'], type: 'function' }, children: [] },
                { mainAspect: { id: 'childAspect2', members: ['object1'], type: 'function' }, children: [] },
            ],
            mainAspect: { id: 'parentAspect', members: ['object1'] },
        } as unknown as AspectNode;
        vi.mocked(findAspectNode).mockReturnValue(parentNode);

        render(<MainAspectPage />);
        expect(screen.getAllByText('MainAspectSection')).toHaveLength(3); // Parent + 2 children
    });

    it('returns empty array for node without mainAspect', () => {
        const noAspectNode: AspectNode = {
            level: 0,
            canonicalPath: 'aspect1',
            mainAspect: null,
            children: [],
        } as unknown as AspectNode;
        vi.mocked(findAspectNode).mockReturnValue(noAspectNode);

        render(<MainAspectPage />);
        expect(screen.queryByText('MainAspectSection')).not.toBeInTheDocument();
    });
});
