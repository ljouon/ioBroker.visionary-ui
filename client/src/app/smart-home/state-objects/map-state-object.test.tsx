import { screen } from '@testing-library/react';
import { render } from '@/test/testing-library-setup';

import { describe, expect, it } from 'vitest';
import { mapToStateObjectComponent } from './map-state-object';
import { StateObject } from '@/app/smart-home/structure/aspect';

describe('mapToStateObjectComponent Function', () => {
    it('renders StateObjectSwitch for boolean type', () => {
        const uiStateObject = {
            id: 'switch1',
            datatype: 'boolean',
            role: 'switch',
            isWriteable: true,
        } as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders StateObjectButton for boolean button type', () => {
        const uiStateObject = {
            id: 'button1',
            datatype: 'boolean',
            role: 'button',
            isWriteable: true,
        } as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders StateObjectSlider for number type with min and max values', () => {
        const uiStateObject = {
            id: 'slider1',
            datatype: 'number',
            role: 'level.dimmer',
            minValue: 0,
            defaultValue: 0,
            value: 0,
            maxValue: 100,
            isWriteable: true,
        } as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('renders StateObjectSelect for number type with states', () => {
        const uiStateObject = {
            id: 'select1',
            name: 'Select',
            role: 'select',
            datatype: 'number',
            defaultValue: 1,
            states: { 1: 'Option 1', 2: 'Option 2' },
            value: 1,
            isWriteable: true,
        } as unknown as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders StateObjectSelect for number type without states but with min and max', () => {
        const uiStateObject = {
            id: 'select1',
            name: 'Select',
            role: 'select',
            datatype: 'number',
            defaultValue: 1,
            minValue: 1,
            maxValue: 2,
            value: 1,
            isWriteable: true,
        } as unknown as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders StateObjectValueOnly for non-writeable types', () => {
        const uiStateObject = {
            id: 'value1',
            displayName: 'value only',
            datatype: 'string',
            isWriteable: false,
        } as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByText('value only')).toBeInTheDocument();
    });

    it('renders StateObjectValueOnly for unknown types', () => {
        const uiStateObject = {
            id: 'unknown1',
            displayName: 'unknown',
            datatype: 'string',
            isWriteable: true,
        } as StateObject;
        render(mapToStateObjectComponent('section1', 'card1', uiStateObject));
        expect(screen.getByText('unknown')).toBeInTheDocument();
    });
});
