import { CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateObject } from '@/domain/aspect';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { useVuiDataContext } from '@/vui-data.context';
import { useEffect, useState } from 'react';

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
        sendVuiAction({ type: 'setValues', data: [{ id: uiStateObject.id, value: newValue }] });
    };

    useEffect(() => {
        setInternalValue(defaultValue);
    }, [defaultValue]);

    return (
        <div className="flex items-center w-full" key={`div_${sectionId}_${cardId}_${uiStateObject.id}`}>
            <div className="flex-none flex items-center ">
                {uiStateObject.customIcon ? (
                    <DynamicIcon
                        className="dark:prose-invert h-8 w-8 lg:w-10 lg:h-10 mr-2 opacity-50"
                        iconKey={uiStateObject.customIcon}
                    />
                ) : undefined}
            </div>
            <div className="flex-grow truncate pl-2 pr-[1px]">
                <Label htmlFor={`${sectionId}_${cardId}_${uiStateObject.id}`}>
                    <CardTitle>
                        <span className="whitespace-nowrap overflow-hidden">
                            {uiStateObject.displayName ? uiStateObject.displayName : uiStateObject.name}
                        </span>
                    </CardTitle>
                    {uiStateObject.description ? (
                        <CardDescription>
                            <span className="whitespace-nowrap overflow-hidden">{uiStateObject.description}</span>
                        </CardDescription>
                    ) : (
                        ''
                    )}
                    {uiStateObject.isWriteable ? (
                        <Select defaultValue={defaultValue} value={internalValue} onValueChange={handleValueChange}>
                            <SelectTrigger className="my-4 w-full">
                                <SelectValue placeholder="No value" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {uiStateObject.states &&
                                        Object.entries(uiStateObject.states).map((entry) => {
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
                    ) : (
                        ''
                    )}
                </Label>
            </div>
            {!uiStateObject.isWriteable ? (
                <div className={'flex-none'}>
                    <span>{uiStateObject.states && uiStateObject.states['' + uiStateObject.value]}</span>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}
