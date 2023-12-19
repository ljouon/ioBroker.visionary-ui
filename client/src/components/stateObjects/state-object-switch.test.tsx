import { render } from '@/test/testing-library-setup';
import { fireEvent, screen } from '@testing-library/react';
import { StateObjectSwitch } from '@/components/stateObjects/state-object-switch';

import { StateObject } from '@/components/aspects/aspect'; // Adjust the import path as necessary

vi.mock('@/vui-data.context', () => ({
    useVuiDataContext: () => ({
        sendVuiAction: vi.fn(),
    }),
}));

describe('StateObjectSwitch Component', () => {
    it('renders with defaultChecked true', () => {
        const uiStateObject = { id: '1', value: true } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('renders with defaultChecked false', () => {
        const uiStateObject = { id: '1', value: false } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('toggles switch value on click', () => {
        const uiStateObject = { id: '1', value: false } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        const switchElement = screen.getByRole('switch');
        fireEvent.click(switchElement);
        expect(switchElement).toHaveAttribute('aria-checked', 'true');
        fireEvent.click(switchElement);
        expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders custom icon if provided', () => {
        const uiStateObject = { id: '1', customIcon: 'lamp' } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByTitle('mdiLamp')).toBeInTheDocument();
    });

    it('renders displayName or name', () => {
        const uiStateObject = { id: '1', name: 'Name', displayName: 'Display Name' } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('Display Name')).toBeInTheDocument();
    });

    it('renders description if provided', () => {
        const uiStateObject = { id: '1', description: 'Description' } as StateObject;
        render(<StateObjectSwitch uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('Description')).toBeInTheDocument();
    });
});
