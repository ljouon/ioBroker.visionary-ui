import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';
import { useEffect, useState } from 'react';
import { CardDescription, CardTitle } from '@/__generated__/components/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/__generated__/components/select';
import { useVuiDataContext } from '@/app/smart-home/data.context';
import { StateObject } from '@/app/smart-home/state-objects/state-object';

export type ObjectEnumProps = {
    sectionId: string;
    cardId: string;
    uiStateObject: StateObject;
};

export function StateObjectSelect({ uiStateObject, sectionId, cardId }: ObjectEnumProps) {
    const defaultValue = `${uiStateObject.value}`;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const { sendVuiAction } = useVuiDataContext();

    const handleValueChange = (newValue: string) => {
        setInternalValue(newValue);
        sendVuiAction({
            type: 'setValues',
            data: [{ id: uiStateObject.id, value: uiStateObject.datatype === 'number' ? Number(newValue) : newValue }],
        });
    };

    useEffect(() => {
        setInternalValue(defaultValue);
    }, [defaultValue]);

    /**
   HmIP set point mode
   0 Auto
   1 Manual
   2 ?
   **/

    let states = uiStateObject.states;
    if (!states && uiStateObject.minValue !== null && uiStateObject.maxValue !== null) {
        states = {};
        for (let i = uiStateObject.minValue; i <= uiStateObject.maxValue; i++) {
            states[i] = String(i);
        }
    }

    return (
        <div className="flex items-center w-full" key={`div_${sectionId}_${cardId}_${uiStateObject.id}`}>
            <div className="flex-none flex items-center ">
                {uiStateObject.customIcon ? (
                    <DynamicMaterialDesignIcon
                        className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                        iconKey={uiStateObject.customIcon}
                    />
                ) : undefined}
            </div>
            <div className="flex-grow truncate pl-2 pr-[1px]">
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
                <Select defaultValue={defaultValue} value={internalValue} onValueChange={handleValueChange}>
                    <SelectTrigger className="my-4 w-full">
                        <SelectValue placeholder="No value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {states &&
                                Object.entries(states).map((entry) => {
                                    return (
                                        <SelectItem
                                            value={entry[0]}
                                            key={`${sectionId}_${cardId}_${uiStateObject.id}_${entry[0]}_select`}
                                        >
                                            {entry[1]}
                                        </SelectItem>
                                    );
                                })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
