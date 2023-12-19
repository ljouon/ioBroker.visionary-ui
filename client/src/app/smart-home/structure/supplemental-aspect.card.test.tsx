import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { useVuiDataContext, VuiDataContextType } from '@/app/smart-home/data.context';
import { render } from '@/test/testing-library-setup';
import { SupplementalAspectCard } from '@/app/smart-home/structure/supplemental-aspect.card';

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

        render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['objId1']} />,
        );

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

        render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['2', '1']} />,
        );

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

        render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['2', '1']} />,
        );

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

        render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['2', '1']} />,
        );

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

        render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['2', '1']} />,
        );

        expect(screen.getByText('Object 1')).toBeInTheDocument();
    });

    it('does not display the card if there are no matching state objects', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            stateObjects: [],
            stateValues: [],
        } as unknown as VuiDataContextType);

        const { container } = render(
            <SupplementalAspectCard id="1" sectionId="section-1" title="Test Card" functionObjectIds={['1']} />,
        );
        expect(container.firstChild).toBeNull();
    });
});
