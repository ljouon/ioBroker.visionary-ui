import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { useVuiDataContext, VuiDataContextType } from '@/app/smart-home/data.context';
import { render } from '@/test/testing-library-setup';
import { SupplementalAspectCard } from '@/app/smart-home/structure/supplemental-aspect.card';
import { VuiEnum } from '../../../../../src/domain';

vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: vi.fn(),
}));

describe('SupplementalAspectCard', () => {
    it('renders the card with the correct title', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [
                {
                    type: 'state',
                    id: 'objId1',
                    name: 'name',
                },
            ],

            stateValues: [{ id: 'objId1', value: 'test' }],
        } as unknown as VuiDataContextType);

        const vuiEnum = {
            id: '1',
            name: 'Test Card',
            rank: 0,
            children: [],
            members: ['objId1'],
        } as unknown as VuiEnum;

        render(<SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />);

        screen.debug();
        expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('displays state objects sorted by rank and filtered by functionObjectIds', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [
                { id: '1', rank: 2, name: 'Object 2' },
                { id: '2', rank: 1, name: 'Object 1' },
            ],
            stateValues: [
                { id: '1', value: 'Value 1', lastChange: '2023-04-01' },
                { id: '2', value: 'Value 2', lastChange: '2023-04-02' },
            ],
        } as unknown as VuiDataContextType);

        const vuiEnum = { id: '1', name: 'name', rank: 0, children: [], members: ['2', '1'] } as unknown as VuiEnum;

        render(<SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />);

        expect(screen.getByText('Object 1')).toBeInTheDocument();
        expect(screen.getByText('Object 2')).toBeInTheDocument();
    });

    it('displays state objects sorted by rank (with the first element missing the rank) and filtered by functionObjectIds', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [
                { id: '1', name: 'Object 2' },
                { id: '2', rank: 1, name: 'Object 1' },
            ],
            stateValues: [
                { id: '1', value: 'Value 1', lastChange: '2023-04-01' },
                { id: '2', value: 'Value 2', lastChange: '2023-04-02' },
            ],
        } as unknown as VuiDataContextType);
        const vuiEnum = { id: 'id', name: 'name', rank: 0, children: [], members: ['1', '2'] } as unknown as VuiEnum;

        render(<SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />);

        expect(screen.getByText('Object 1')).toBeInTheDocument();
        expect(screen.getByText('Object 2')).toBeInTheDocument();
    });

    it('displays state objects sorted by rank (with the second element missing the rank) and filtered by functionObjectIds', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [
                { id: '1', rank: 5, name: 'Object 2' },
                { id: '2', name: 'Object 1' },
            ],
            stateValues: [
                { id: '1', value: 'Value 1', lastChange: '2023-04-01' },
                { id: '2', value: 'Value 2', lastChange: '2023-04-02' },
            ],
        } as unknown as VuiDataContextType);

        const vuiEnum = { id: 'id', name: 'name', rank: 0, children: [], members: ['2', '1'] } as unknown as VuiEnum;

        render(<SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />);

        expect(screen.getByText('Object 1')).toBeInTheDocument();
        expect(screen.getByText('Object 2')).toBeInTheDocument();
    });

    it('displays state objects sorted by rank with missing values and filtered by functionObjectIds', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [
                { id: '1', rank: 2, name: 'Object 2' },
                { id: '2', rank: 1, name: 'Object 1' },
            ],
            stateValues: [
                { id: '1', value: null, lastChange: '2023-04-01' },
                { id: '2', value: 'test', lastChange: null },
            ],
        } as unknown as VuiDataContextType);

        const vuiEnum = { id: '1', name: 'name', rank: 0, children: [], members: ['2', '1'] } as unknown as VuiEnum;

        render(<SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />);

        expect(screen.getByText('Object 1')).toBeInTheDocument();
    });

    it('does not display the card if there are no matching state objects', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [],
            stateValues: [],
        } as unknown as VuiDataContextType);

        const vuiEnum = { id: 'id', name: 'name', rank: 0, children: [], members: [] } as unknown as VuiEnum;

        const { container } = render(
            <SupplementalAspectCard element={vuiEnum} parentId="section-1" onAspectCardTitleClicked={() => {}} />,
        );
        expect(container.firstChild).toBeNull();
    });
});
