import { act, fireEvent, screen } from '@testing-library/react';
import { render } from '@/test/testing-library-setup';

import { describe, expect, it, vi } from 'vitest';
import { StateObjectSlider } from '@/app/smart-home/state-objects/state-object-slider';
import { StateObject } from '@/app/smart-home/structure/aspect';

const sendVuiAction = vi.fn();
vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: () => ({
        sendVuiAction: sendVuiAction,
    }),
}));

const mockInput = vi.fn();

vi.mock('@/__generated__/components/slider', () => ({
    Slider: vi.fn().mockImplementation(({ onValueChange, onValueCommit, value, props }) => {
        mockInput(props);
        return (
            <div {...props}>
                <button onClick={() => onValueChange([60])}>Change Value</button>
                <button onClick={() => onValueCommit([60])}>Commit Value</button>
                <div>Current Value: {value}</div>
            </div>
        );
    }),
}));

describe('StateObjectSlider Component', () => {
    it('renders with initial value and unit', () => {
        const uiStateObject = { id: '1', value: 50, unit: 'unit' } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('50 unit')).toBeInTheDocument();
    });

    it('renders percentage value when no unit is provided and maxValue is set', () => {
        const uiStateObject = { id: '1', value: 50, maxValue: 100 } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('50 %')).toBeInTheDocument();
    });

    it('renders custom icon if provided', () => {
        const uiStateObject = { id: '1', customIcon: 'lamp' } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByTitle('mdiLamp')).toBeInTheDocument();
    });

    it('renders displayName or name', () => {
        const uiStateObject = { id: '1', name: 'Name', displayName: 'Display Name' } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('Display Name')).toBeInTheDocument();
    });

    it('renders description if provided', () => {
        const uiStateObject = { id: '1', description: 'Description' } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('handles slider value change', async () => {
        const uiStateObject = { id: '1', value: 50, minValue: 0, maxValue: 100, isWriteable: true } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        // Simulate slider value change
        const changeButton = screen.getByText('Change Value');
        await act(async () => {
            fireEvent.click(changeButton);
        });

        const commitButton = screen.getByText('Commit Value');
        fireEvent.click(commitButton);
        expect(sendVuiAction).toHaveBeenCalled();
    });

    it('handles slider value change', async () => {
        const uiStateObject = {
            id: '1',
            value: 50,
            minValue: null,
            maxValue: null,
            isWriteable: true,
        } as StateObject;
        render(<StateObjectSlider uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        // Simulate slider value change
        const changeButton = screen.getByText('Change Value');
        await act(async () => {
            fireEvent.click(changeButton);
        });

        const commitButton = screen.getByText('Commit Value');
        fireEvent.click(commitButton);
        expect(sendVuiAction).toHaveBeenCalled();
    });
});
