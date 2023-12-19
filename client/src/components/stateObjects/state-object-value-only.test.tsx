import { describe, it } from 'vitest';
import { StateObjectValueOnly } from '@/components/stateObjects/state-object-value-only';
import { render } from '@/test/testing-library-setup';
import { screen } from '@testing-library/react';

import { StateObject } from '@/components/aspects/aspect';

describe('StateObjectValueOnly Component', () => {
    describe('StateObjectValueOnly Component', () => {
        it('renders boolean uiStateObject with true value', () => {
            const uiStateObject = { id: '1', datatype: 'boolean', value: true } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByTitle('mdiCheckCircleOutline')).toBeInTheDocument();
        });

        it('renders boolean uiStateObject with false value', () => {
            const uiStateObject = { id: '1', datatype: 'boolean', value: false } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByTitle('mdiCloseCircleOutline')).toBeInTheDocument(); // Adjust the title as per your implementation
        });

        it('renders string uiStateObject', () => {
            const uiStateObject = { id: '1', datatype: 'string', value: 'Test', unit: 'kg' } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByText('Test kg')).toBeInTheDocument();
        });

        it('renders number uiStateObject with states', () => {
            const uiStateObject = {
                id: '1',
                datatype: 'number',
                value: 1,
                states: ['Off', 'On'],
                unit: 'unit',
            } as unknown as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByText('On unit')).toBeInTheDocument();
        });

        it('renders number uiStateObject without states', () => {
            const uiStateObject = {
                id: '1',
                datatype: 'number',
                value: 2,
                unit: 'unit',
            } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByText('2 unit')).toBeInTheDocument();
        });

        it('renders custom icon if provided', async () => {
            const uiStateObject = { id: '1', customIcon: 'thermostat-box' } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByTitle('mdiThermostatBox')).toBeInTheDocument();
        });

        it('renders displayName or name', () => {
            const uiStateObject = {
                id: '1',
                datatype: 'string',
                value: 'Test',
                unit: 'kg',
                name: 'Name',
                displayName: 'Display Name',
            } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByText('Display Name')).toBeInTheDocument();
        });

        it('renders description if provided', () => {
            const uiStateObject = { id: '1', description: 'Description' } as StateObject;
            render(<StateObjectValueOnly uiStateObject={uiStateObject} sectionId="s1" cardId="c1" />);
            expect(screen.getByText('Description')).toBeInTheDocument();
        });
    });
});
