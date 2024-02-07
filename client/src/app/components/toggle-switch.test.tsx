import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {render} from '@/test/testing-library-setup'; // Adjust the import path as necessary
import {ToggleSwitch} from './toggle-switch';

describe('ToggleSwitch Component', () => {
    it('initializes with the correct value', () => {
        render(
            <ToggleSwitch
                initialValue="leftValue"
                highlightValue="leftValue"
                left={{value: 'leftValue', label: 'Left'}}
                right={{value: 'rightValue', label: 'Right'}}
                onSwitch={vi.fn()}
            />,
        );
        expect(screen.getByText('Left')).toHaveClass('text-foreground');
        expect(screen.getByText('Right')).toHaveClass('opacity-50');
    });

    it('triggers onSwitch with the new value when clicked', () => {
        const onSwitchMock = vi.fn();
        render(
            <ToggleSwitch
                initialValue="leftValue"
                highlightValue="leftValue"
                left={{value: 'leftValue', label: 'Left'}}
                right={{value: 'rightValue', label: 'Right'}}
                onSwitch={onSwitchMock}
            />,
        );
        fireEvent.click(screen.getByText('Right'));
        expect(onSwitchMock).toHaveBeenCalledWith('rightValue');
    });

    it('triggers onSwitch for the other value as default when clicked on "Right"', () => {
        const onSwitchMock = vi.fn();
        render(
            <ToggleSwitch
                initialValue="rightValue"
                highlightValue="leftValue"
                left={{value: 'leftValue', label: 'Left'}}
                right={{value: 'rightValue', label: 'Right'}}
                onSwitch={onSwitchMock}
            />,
        );
        fireEvent.click(screen.getByText('Right'));
        expect(onSwitchMock).toHaveBeenCalledWith('leftValue');
    });

    it('triggers onSwitch for the other value as default when clicked on "Left"', () => {
        const onSwitchMock = vi.fn();
        render(
            <ToggleSwitch
                initialValue="rightValue"
                highlightValue="leftValue"
                left={{value: 'leftValue', label: 'Left'}}
                right={{value: 'rightValue', label: 'Right'}}
                onSwitch={onSwitchMock}
            />,
        );
        fireEvent.click(screen.getByText('Left'));
        expect(onSwitchMock).toHaveBeenCalledWith('leftValue');
    });

    it('displays the left and right labels correctly', () => {
        render(
            <ToggleSwitch
                initialValue="leftValue"
                highlightValue="leftValue"
                left={{value: 'leftValue', label: 'Left'}}
                right={{value: 'rightValue', label: 'Right'}}
                onSwitch={vi.fn()}
            />,
        );
        expect(screen.getByText('Left')).toBeInTheDocument();
        expect(screen.getByText('Right')).toBeInTheDocument();
    });
});
