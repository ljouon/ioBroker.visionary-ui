import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { useVuiDataContext, VuiDataContextType } from '@/app/smart-home/data.context';
import { useNavigate } from 'react-router-dom';
import { render } from '@/test/testing-library-setup';
import { HomePage } from '@/app/smart-home/structure/home.page';
import { screen } from '@testing-library/react';

vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    generatePath: vi.fn(),
}));
vi.mock('@/app/components/error', () => ({
    ErrorDisplay: () => (
        <div>
            ErrorDisplay
            <span>no_connection_to_server</span>
        </div>
    ),
}));
// vi.mock('react-i18next', () => ({
//     useTranslation: () => ({ t: (key: string) => key }),
// }));
vi.mock('react-i18next', async () => {
    const actual = await vi.importActual('react-i18next');
    return {
        ...actual,
        useTranslation: () => ({ t: (key: string) => key }),
    };
});

describe('HomePage Component', () => {
    it('does not navigate if there are no room aspect nodes', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'OPEN',
            roomAspectNodes: [],
        } as unknown as VuiDataContextType);

        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<HomePage />);

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('displays error when connection state is not OPEN', () => {
        vi.mocked(useVuiDataContext).mockReturnValue({
            connectionState: 'CLOSED',
            roomAspectNodes: [],
        } as unknown as VuiDataContextType);

        render(<HomePage />);

        expect(screen.getByText('ErrorDisplay')).toBeInTheDocument();
        expect(screen.getByText('no_connection_to_server')).toBeInTheDocument();
    });
});
