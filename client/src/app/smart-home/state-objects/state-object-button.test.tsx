import { render } from '@/test/testing-library-setup';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StateObject } from '@/app/smart-home/state-objects/state-object';
import { StateObjectButton } from '@/app/smart-home/state-objects/state-object-button';

const sendVuiAction = vi.fn();
vi.mock('@/app/smart-home/data.context', () => ({
    useVuiDataContext: () => ({
        sendVuiAction: sendVuiAction,
    }),
}));

describe('StateObjectButton Component', () => {
    it('renders correctly with display name and description', () => {
        const uiStateObject = {
            id: '1',
            name: 'ButtonName',
            displayName: 'Display Name',
            description: 'Description',
            customIcon: 'lamp',
        } as StateObject;
        render(<StateObjectButton uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        expect(screen.getByText('Display Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByTitle('mdiLamp')).toBeInTheDocument();
    });

    it('triggers sendVuiAction on button click', () => {
        const uiStateObject = { id: '1', name: 'ButtonName' } as StateObject;
        render(<StateObjectButton uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(sendVuiAction).toHaveBeenCalledWith({
            type: 'setValues',
            data: [{ id: uiStateObject.id, value: true }],
        });
    });

    // Additional tests for rendering without custom icon, without displayName, etc., can be added if needed.
});
