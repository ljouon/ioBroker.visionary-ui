import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { useEffect, useState } from 'react';
import { CardDescription, CardTitle } from '@/__generated__/components/card';
import { Slider } from '@/__generated__/components/slider';
import { StateObject } from '@/app/smart-home/state-objects/state-object';

export type StateObjectSliderProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectSlider({ uiStateObject, sectionId, cardId }: StateObjectSliderProps) {
    const [internalValue, setInternalValue] = useState(uiStateObject.value);
    const { sendVuiAction } = useVuiDataContext();

    let valueString = '';

    if (uiStateObject.unit) {
        valueString = uiStateObject.value + ' ' + uiStateObject.unit;
    } else if (uiStateObject.value !== null && uiStateObject.maxValue && uiStateObject.maxValue > 0) {
        valueString = Math.round((Number(uiStateObject.value) / uiStateObject.maxValue) * 100) + ' %';
    }

    const handleValueChange = (newValue: number[]) => {
        setInternalValue(newValue[0]);
    };

    const handleValueCommit = (newValue: number[]) => {
        sendVuiAction({ type: 'setValues', data: [{ id: uiStateObject.id, value: newValue[0] }] });
    };

    useEffect(() => {
        setInternalValue(uiStateObject.value);
    }, [uiStateObject.value]);

    return (
        <div className="flex-row w-full">
            <div className="flex items-center w-full" key={`div_${sectionId}_${cardId}_${uiStateObject.id}`}>
                <div className="flex-none flex items-center ">
                    {uiStateObject.customIcon ? (
                        <DynamicMaterialDesignIcon
                            className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                            iconKey={uiStateObject.customIcon}
                        />
                    ) : undefined}
                </div>
                <div className="flex-grow truncate pl-2 mr-2">
                    <CardTitle>
                        <span className="ml-0 whitespace-nowrap overflow-hidden text-sm font-semibold leading-none tracking-tight">
                            {uiStateObject.displayName ? uiStateObject.displayName : uiStateObject.name}
                        </span>
                    </CardTitle>
                    {uiStateObject.description ? (
                        <CardDescription>
                            <span className="whitespace-nowrap overflow-hidden">{uiStateObject.description}</span>
                        </CardDescription>
                    ) : undefined}
                </div>
                <div className="flex-none">{valueString}</div>
            </div>
            {uiStateObject.isWriteable ? (
                <Slider
                    hideThumb={!uiStateObject.isWriteable}
                    disabled={!uiStateObject.isWriteable}
                    className={'ml-1 pr-2 my-4 cursor-pointer'}
                    id={`${sectionId}_${cardId}_${uiStateObject.id}`}
                    min={uiStateObject.minValue || undefined}
                    max={uiStateObject.maxValue || undefined}
                    onValueChange={handleValueChange}
                    onValueCommit={handleValueCommit}
                    value={internalValue !== null ? [Number(internalValue)] : []}
                    defaultValue={uiStateObject.value !== null ? [Number(uiStateObject.value)] : []}
                />
            ) : undefined}
        </div>
    );
}
