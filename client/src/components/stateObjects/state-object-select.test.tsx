import { fireEvent, screen } from '@testing-library/react';
import { StateObjectSelect } from '@/components/stateObjects/state-object-select';
import { StateObject } from '@/components/aspects/aspect';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test/testing-library-setup';

// Mock the custom Select component
vi.mock('@/__generated__/components/select', () => ({
    Select: vi.fn().mockImplementation(({ children, defaultValue, onValueChange }) => (
        <select defaultValue={defaultValue} onChange={(e) => onValueChange(e.target.value)}>
            {children}
        </select>
    )),
    SelectTrigger: vi.fn(({ children }) => <>{children}</>),
    SelectContent: vi.fn(({ children }) => <>{children}</>),
    SelectGroup: vi.fn(({ children }) => <>{children}</>),
    SelectItem: vi.fn(({ children, value }) => <option value={value}>{children}</option>),
    SelectValue: vi.fn(() => <></>),
}));

const sendVuiAction = vi.fn();
vi.mock('@/components/aspects/vui-data.context', () => ({
    useVuiDataContext: () => ({
        sendVuiAction: sendVuiAction,
    }),
}));

describe('StateObjectSelect Component', () => {
    it('renders with initial value', () => {
        const uiStateObject = {
            id: '1',
            value: '1',
            states: { '1': 'Option 1', '2': 'Option 2' },
            isWriteable: true,
        } as unknown as StateObject;
        render(<StateObjectSelect uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        // Check if the initial value is displayed. Adjust based on how the value is displayed.
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('handles value change', async () => {
        const uiStateObject = {
            id: '1',
            value: '1',
            states: { '1': 'Option 1', '2': 'Option 2' },
            isWriteable: true,
        } as unknown as StateObject;
        render(<StateObjectSelect uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: '2' } });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(selectElement.value).toBe('2');
        expect(sendVuiAction).toHaveBeenCalledWith({ type: 'setValues', data: [{ id: uiStateObject.id, value: '2' }] });
    });

    it('renders with custom icon, displayName, and description', () => {
        const uiStateObject = {
            id: '1',
            customIcon: 'lamp',
            displayName: 'Display Name',
            description: 'Description',
            value: '1',
            states: { '1': 'Option 1', '2': 'Option 2' },
            isWriteable: true,
        } as unknown as StateObject;
        render(<StateObjectSelect uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByTitle('mdiLamp')).toBeInTheDocument();
        expect(screen.getByText('Display Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders without states and creates options from min and max values', () => {
        const uiStateObject = {
            id: '1',
            customIcon: 'lamp',
            displayName: 'Display Name',
            description: 'Description',
            minValue: '0',
            maxValue: '2',
            value: '1',
            isWriteable: true,
        } as unknown as StateObject;
        render(<StateObjectSelect uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        const selectElement = screen.getByRole('combobox');
        fireEvent.click(selectElement);
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });
});
