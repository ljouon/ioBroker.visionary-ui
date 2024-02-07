import {ReactNode} from 'react';

export type SwitchingValue<T> = {
    value: T;
    label: string;
};

interface ToggleSwitchProps<T> {
    initialValue: string;
    highlightValue: string;
    left: SwitchingValue<T>;
    right: SwitchingValue<T>;
    onSwitch: (value: T) => void; // Callback function prop
}

export function ToggleSwitch<T>({
                                    initialValue,
                                    highlightValue,
                                    left,
                                    right,
                                    onSwitch
                                }: ToggleSwitchProps<T>): ReactNode {
    const active = initialValue === left.value;
    const highlightLeft = highlightValue === left.value;

    const toggle = () => {
        const newValue = active ? right.value : left.value; // Determine the new value based on the toggle state
        onSwitch(newValue); // Trigger the callback with the new value
    };

    return (
        <div className="relative inline-block w-full py-2 bg-accent rounded-lg cursor-pointer" onClick={toggle}>
            <div
                className={`absolute top-0 bottom-0 ${
                    active ? 'left-0 right-1/2' : 'right-0 left-1/2'
                } bg-background shadow bg-opacity-80 transition-all duration-500 ease-in-out rounded-sm m-0.5`}
            ></div>
            <div className="flex w-full">
                <span
                    className={`${active ? 'text-foreground' : 'opacity-50'} text-xs flex w-1/2 justify-center items-center z-10 relative`}
                >
                    {highlightLeft ?
                        <div className='border-primary border-2 w-0.5 h-3 absolute left-2'/> : ''}
                    {left.label}
                </span>
                <span
                    className={`${!active ? 'text-foreground' : 'opacity-50'} font-normal text-xs flex w-1/2 justify-center items-center z-10 relative`}
                >
                    {!highlightLeft ?
                        <div className='border-primary border-2 w-0.5 h-3 absolute left-2'/> : ''}
                    {right.label}
                </span>
            </div>
        </div>
    );
}
